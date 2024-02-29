import { Command, DiscordEvent, Task } from "./interfaces/discord";
import { Client, ClientOptions, Collection } from "discord.js";
import { YamlDatabase } from "wio.db";
import fs from 'fs';
import { SquareCloudAPI, User } from "@squarecloud/api";

const ReadDirectory = <T>(path: string) => {

    const files: T[] = []

    for (const filename of fs.readdirSync(`./dist/${path}`)) {

        const stat = fs.statSync(`./dist/${path}/${filename}`);

        if (stat.isDirectory()) files.push(...ReadDirectory<T>(`${path}/${filename}`));
        else files.push(require(`./${path}/${filename}`).default);

    }

    return files;

}

class CustomClient extends Client<true> {

    commands: Command[] = ReadDirectory<Command>('commands')
    tasks: Task[] = ReadDirectory<Task>('tasks')
    interactions = new YamlDatabase<{ author_id: string, created_in: number } & Record<string, any>>({ databasePath: "./database/interactions" });
    general_db = new YamlDatabase<{ slash_send: boolean }>({ databasePath: "./database/config" });
    square_api = new SquareCloudAPI(process.env.SQUARE_CLOUD_API_KEY!)

    constructor(options: ClientOptions) {

        super(options);

        for (const event of ReadDirectory<DiscordEvent<any>>('events')) this.on(event.name, event.listener.bind(null, this));

        this.login(process.env.DISCORD_TOKEN)
        this.once('ready', async () => {
            await this.registerSlash();
            await this.get_applications();
        })

    }

    private last_applications_load_data: User['applications'] = new Collection();
    private last_applications_load = 0;

    async get_applications() {

        try {

            if (this.last_applications_load - (1000 * 30) > Date.now()) {

                const { applications } = await this.square_api.users.get();

                if (this.last_applications_load === 0) console.log(`\x1b[36m${applications.size} aplicações\x1b[32m da Square Cloud carregadas com sucesso!\x1b[0m`);

                this.last_applications_load_data = applications

            } else return this.last_applications_load_data

        } catch (e: any) {

            console.error(
                `\x1b[31m%s\x1b[33m (%s)\x1b[0m - \x1b[32mVerifique se a sua API Key está correta!\x1b[0m`,
                `Ocorreu um erro ao buscar as suas aplicações hospedadas na Square Cloud!`,
                `${e.message}`
            )

            process.exit(1);

        };
        
    }

    private async registerSlash() {

        if (process.env.DEVELOPMENT_GUILD_ID) {

            const guild = await this.guilds.fetch(process.env.DEVELOPMENT_GUILD_ID);
            const commands = this.commands.map(x => x.data);

            await guild.commands.set(commands)
            await this.application.commands.set([])

        } else {

            const data = this.general_db.get("config");
            const commands = this.commands.map(x => x.data);

            if (!data.slash_send) {

                await this.application.commands.set(commands)

                this.general_db.set("config", { slash_send: true })

            }

        }
    }

}

export {
    CustomClient
}
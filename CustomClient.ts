import { Command, DiscordEvent, Task } from "./interfaces/discord";
import { Client, ClientOptions } from "discord.js";
import { YamlDatabase } from "wio.db";
import fs from 'fs';

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

    constructor(options: ClientOptions) {

        super(options);

        for (const event of ReadDirectory<DiscordEvent<any>>('events')) this.on(event.name, event.listener.bind(null, this));

        this.login(process.env.DISCORD_TOKEN)
        this.once('ready', this.registerSlash)

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
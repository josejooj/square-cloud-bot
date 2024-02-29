import { Command } from '../interfaces/discord'
import build_message from '../tasks/manage_app/build_message';

const command: Command = {
    data: {
        name: "apps",
        description: "[🤖] Gerencie os seus Apps hospedados na Square Cloud",
        options: [{
            type: 3,
            name: "app",
            description: "Aplicação que você deseja gerenciar",
            autocomplete: true,
            required: true
        }]
    },
    handler: async (client, int) => {

        await int.deferReply();

        const app_id = int.options.getString("app");
        const app = await client.square_api.applications.get(app_id || "").catch(() => { });

        if (!app) return int.editReply({ embeds: [{ color: 0xFFFF00, description: `⚠️ | Aplicação não encontrada!` }] })

        const status = await app.getStatus();
        const logs = await Promise.race([app.getLogs(), new Promise(r => setTimeout(r.bind(null, ""), 2000))]).catch(() => "") as string;
        const message_data = build_message(app, status, logs, Date.now());
        const message = await int.editReply(message_data)

        client.interactions.set(message.id, { app, status, logs, author_id: int.user.id, created_in: Date.now() })

    },
    auto_complete: async (client, int) => {

        const applications = await client.get_applications();

        if (!applications?.size) {
            return int.respond([{ name: "⚠️ Você ainda não tem nenhum app hospedado!", value: "0" }])
        }

        const text = int.options.getFocused();
        const values = []

        for (const app of applications.toJSON()) {

            values.push({
                name: `${app.isWebsite ? "🌐" : "🤖"} ID: ${app.id} | Nome: ${app.tag}`,
                value: app.id
            })

        }

        const result = values?.filter(app => app.name.includes(text))

        int.respond(result.slice(0, 25) || [{ name: "⚠️ Nenhuma aplicação encontrada!", value: "0" }])

    }
}

export default command;
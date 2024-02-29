import { Command } from '../interfaces/discord'

const command: Command = {
    data: {
        name: "apps",
        description: "[🤖] Gerencie os seus Apps hospedados na Square Cloud",
        options: [{
            type: 3,
            name: "app",
            description: "Aplicação que você deseja gerenciar",
            autocomplete: true
        }]
    },
    handler: async (client, int) => {

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
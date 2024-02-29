import { AttachmentBuilder } from 'discord.js';
import { Task } from '../../../interfaces/discord';
import { Application } from '../../../interfaces/square';

const command: Task = {
    name: "logs",
    handler: async (client, int, data) => {

        if (!int.isButton()) return;

        const app = data.app as Application;

        if (!app.logs) return int.reply({
            embeds: [{ color: 0xFFFF00, description: `⚠️ Essa aplicação não tem logs registrada!` }],
            ephemeral: true
        })

        if (app.logs.length > 4000) {

            const file = Buffer.from(app.logs);
            const attachment = new AttachmentBuilder(file, {
                name: `[${new Date(data.created_in).toLocaleString('pt-BR').replace(", ", " às ")}] - ${app.id}.log`
            })

            return int.reply({
                embeds: [{ color: 0x333399, description: "Como as logs tem mais de 4000 caracteres, tive que enviar em um arquivo!" }],
                files: [attachment],
                ephemeral: true
            })

        } else {

            return int.reply({
                embeds: [{ color: 0x333399, description: `\`\`\`ts\n${app.logs}\`\`\`` }],
                ephemeral: true
            })

        }

    }
}

export default command;
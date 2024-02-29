import { Task } from '../../../interfaces/discord';
import { inspect } from 'util';

const command: Task = {
    name: "backup",
    handler: async (client, int, data) => {

        if (!int.isButton()) return;
        if (data.app.backup_url) return int.reply({
            embeds: [{ color: 0x1d4fd8, description: `✅ _Backup gerado com sucesso! [**Baixar**](${data.app.backup_url})_` }],
            ephemeral: true
        })

        await int.reply({
            embeds: [{ color: 0x1d4fd8, description: `⏱️ Gerando backup...` }],
            ephemeral: true
        })

        try {

            const app = await client.square_api.applications.get(data.app.id)
            const backup_url = await app.backup.url();

            await int.editReply({
                embeds: [{ color: 0x333399, description: `✅ _Backup gerado com sucesso! [**Baixar**](${backup_url})_` }]
            })

            client.interactions.set(int.message.id, { ...data, app: { ...data.app, backup_url: backup_url } })

        } catch (e) {

            await int.editReply({
                embeds: [{
                    color: 0x333399,
                    description:
                        `❌ Ocorreu um erro ao gerar o backup!\n` +
                        `\`\`\`ts\n` +
                        `${inspect(e, { depth: Infinity })}\n` +
                        `\`\`\``
                }]
            })

        }

    }
}

export default command;
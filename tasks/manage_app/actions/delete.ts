import { Task } from '../../../interfaces/discord';

const command: Task = {
    name: "delete",
    handler: async (client, int, data) => {

        const action = int.customId.split('-')[1];

        if (!action) return int.update({
            embeds: [{
                color: 0xFFFF00,
                description:
                    `⚠️ **Você tem certeza de que deseja apagar a sua aplicação?**\n`
            }],
            components: [{
                type: 1,
                components: [
                    {
                        style: 3,
                        label: "Confirmar exclusão",
                        custom_id: "delete-y",
                        emoji: { name: "✅" }
                    },
                    {
                        style: 2,
                        label: "Cancelar exclusão",
                        custom_id: "manageapp",
                        emoji: { name: "❌" }
                    }
                ].map(x => ({ type: 2, ...x }))
            }]
        })

        await int.update({
            embeds: [{ color: 0xFFFF00, description: `⏱️ Apagando aplicação` }],
            components: []
        })

        const app = await client.square_api.applications.get(data.app.id);
        const backup_url = await app.backup.url().catch(() => { });

        await app.delete();
        await int.editReply({
            embeds: [{ color: 0x00FF00, description: `✅ Aplicação \`${data.app.name}\` deletada permanentemente!` }],
            components: backup_url ? [{ type: 1, components: [{ type: 2, style: 5, url: backup_url, label: "Baixar backup" }] }] : undefined
        })

    }
}

export default command;
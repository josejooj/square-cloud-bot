import { Task } from '../../../interfaces/discord';
import { inspect } from 'util';

const command: Task = {
    name: "rebuild",
    handler: async (client, int, data) => {

        if (data.app.is_website) return int.reply({
            embeds: [{ color: 0xFFFF00, description: `❌ Por questões de segurança, não é possível rebuildar sites.` }]
        })

        const action = int.customId.split('-')[1];

        if (!action) return int.update({
            embeds: [{
                color: 0xFFFF00,
                title: "⚠️ Você tem certeza?",
                description:
                    `- O processo de Rebuild consiste em fazer o re-upload de sua aplicação\n` +
                    `- Isso pode ser útil para corrigir alguns erros relacionados ao seu ambiente\n` +
                    `- OBS: Como a API ainda não permite, será necessário que você re-configure manualmente ` +
                    `o domínio personalizado e integração com o Github na [Dashboard](https://squarecloud.app/dashboard), caso você tenha configurado.`
            }],
            components: [{
                type: 1,
                components: [
                    {
                        style: 3,
                        label: "Rebuildar aplicação",
                        custom_id: "rebuild-y",
                        emoji: { name: "✅" }
                    },
                    {
                        style: 2,
                        label: "Cancelar rebuild",
                        custom_id: "manageapp",
                        emoji: { name: "❌" }
                    }
                ].map(x => ({ type: 2, ...x }))
            }]
        })

        const replyError = async (e: unknown, action: string) => await int.editReply({
            embeds: [{
                color: 0x333399,
                description:
                    `❌ Ocorreu um erro ${action}!\n` +
                    `\`\`\`ts\n` +
                    `${inspect(e, { depth: Infinity })}\n` +
                    `\`\`\``
            }]
        })

        await int.update({
            embeds: [{ color: 0xFFFF00, description: `⏱️ _Capturando informações da aplicação..._` }],
            components: []
        })

        const app = await client.square_api.applications.get(data.app.id);

        await int.editReply({
            embeds: [{ color: 0xFFFF00, description: `⏱️ _Gerando backup da aplicação para o reupload..._` }]
        })

        try {

            const backup = await app.backup.download();

            await int.editReply({
                embeds: [{ color: 0xFFFF00, description: `⏱️ _Enviando a nova aplicação..._` }]
            })

            try {

                const new_app = await client.square_api.applications.create(backup);

                try {

                    await int.editReply({
                        embeds: [{ color: 0xFFFF00, description: `⏱️ _Aplicação enviada com o ID \`${new_app.id}\`! Apagando aplicação antiga..._` }]
                    })

                    await app.delete();

                } catch (e) {
                    await app.delete().catch(() => { });
                }

                await int.editReply({
                    embeds: [{
                        color: 0x00FF00,
                        description: `✅ Aplicação Rebuildada com sucesso!\n`
                    }],
                    components: [{
                        type: 1,
                        components: [
                            { type: 2, style: 5, url: `https://squarecloud.app/dashboard/app/${new_app.id}`, label: "Ir para a Dashboard" }
                        ]
                    }]
                })

            } catch (e) {
                await replyError(e, "ao enviar a nova aplicação")
            }

        } catch (e) {
            await replyError(e, "ao gerar o backup")
        }
    }
}

export default command;
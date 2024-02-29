import { Command } from '../interfaces/discord'
import { inspect } from 'util';

type StatsResponse = { status: 'success', response?: { statistics?: Record<'users' | 'apps' | 'websites' | 'ping', number> } } | void

const command: Command = {
    data: {
        name: "estatisticas",
        description: "[📡] Estatísticas do BOT e da Square Cloud"
    },
    handler: async (client, int) => {

        const defer_init = Date.now();
        await int.deferReply();
        const defer_time = Date.now() - defer_init;

        try {

            const square_request_init = Date.now();
            const square_stats = await client.square_api.api.fetch('/service/statistics').catch(() => { }) as unknown as StatsResponse;
            const square_request_time = Date.now() - square_request_init;

            await int.editReply({
                embeds: [{
                    color: 0x00FF00,
                    description:
                        `- 👥 **Usuários registrados**: \`${square_stats?.response?.statistics?.users || "Desconhecido"}\`\n` +
                        `- 🖥️ **Aplicações hospedadas**: \`${square_stats?.response?.statistics?.apps || "Desconhecido"}\`\n` +
                        `- 🌐 **Websites hospedados**: \`${square_stats?.response?.statistics?.websites || "Desconhecido"}\`\n` +
                        `- 📡 **Latência**:\n` +
                        ` - Discord API: ${defer_time}ms\n` +
                        ` - Discord Gateway: ${client.ws.ping}ms\n` +
                        ` - Square API Ping: ${square_request_time}ms`
                }]
            })

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
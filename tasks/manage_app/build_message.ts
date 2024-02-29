import { Application, ApplicationStatus } from "@squarecloud/api";
import { APIEmbed, ButtonComponentData } from "discord.js";

const languages = {
    'typescript': "TypeScript",
    'javascript': "JavaScript",
    'python': "Python",
    'java': "Java",
    'elixir': "Elixir",
    'rust': "Rust",
    'php': "PHP",
    'go': "Go"
}

export default function (app: Application, status: ApplicationStatus, logs: string, created_in: number, action: 'starting' | 'restarting' | 'stopping' | 'none' = 'none') {

    const embed: APIEmbed = {
        title: `\`${app.isWebsite() ? "🌐" : "🤖"}\` | ${app.isWebsite() ? "Website/API" : "Aplicação"} - ${app.name}`,
        description: app.description ? `📖 ${app.description}` : "",
        color: 0x1d4ed8,
        fields: [
            { name: "🏷️ Nome", value: app.name, inline: true },
            { name: "🖥️ Cluster", value: app.cluster.toUpperCase(), inline: true },
            { name: "📚 Linguagem", value: `${languages[app.language as keyof typeof languages] || app.language}`, inline: true },
            {
                name: `${status.running ? "🟢" : "🔴"} Status`,
                value: `${status.running && status.uptimeTimestamp ? `Em execução <t:${Math.floor(status.uptimeTimestamp / 1000)}:R>` : "Parado"}`,
                inline: true
            },
            { name: "📟 Memória RAM", value: `${status.usage.ram} / ${app.ram.toFixed(2)}MB`, inline: true },
            { name: "🧠 Processamento", value: `${status.usage.cpu}`, inline: true },
            { name: "🌐 Uso de rede (Total)", value: `${status.usage.network.total}`, inline: true },
            { name: "🌐 Uso de rede (Agora)", value: `${status.usage.network.now}`, inline: true },
            { name: "🔖 ID", value: `||\`${app.id}\`||`, inline: true },
            {
                name: `📜 Últimas 10 logs (Atualizada <t:${Math.floor(created_in / 1000)}:R>)`,
                value: `\`\`\`ts\n${logs.split("\n").slice(-10).join("\n") || "Nenhum log encontrado"}\`\`\``
            }
        ]
    }

    const components: ButtonComponentData[][] = [
        [
            { type: 2, style: 3, emoji: { name: "🚀" }, customId: "start", label: "Iniciar", disabled: !status.running },
            { type: 2, style: 1, emoji: { name: "🔄" }, customId: "restart", label: "Reiniciar", disabled: !status.running },
            { type: 2, style: 4, emoji: { name: "⛔" }, customId: "stop", label: "Parar", disabled: status.running },
            { type: 2, style: 2, emoji: { name: "📜" }, customId: "logs", label: "Logs", disabled: !status.running },
            { type: 2, style: 2, emoji: { name: "💾" }, customId: "backup", label: "Backup" }
        ],
        [
            { type: 2, style: 2, emoji: { name: "📂" }, customId: "files", label: "Gerenciar arquivos" },
            { type: 2, style: 2, emoji: { name: "✨" }, customId: "rebuild", label: "Rebuildar" },
            { type: 2, style: 2, emoji: { name: "👥" }, customId: "team", label: "Equipe", disabled: true },
            { type: 2, style: 4, emoji: { name: '🗑️' }, customId: "delete", label: "Apagar" }
        ]
    ]

    if (action !== "none") {
        for (const row of components) {
            for (const button of row) button.disabled = true;
        }
    }

    return { embeds: [embed], components: components.map(component => ({ type: 1, components: component })) }

}
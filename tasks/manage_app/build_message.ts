import { Application, ApplicationStatus } from "@squarecloud/api";
import { APIEmbed } from "discord.js";

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

export default function (app: Application, status: ApplicationStatus, action: 'starting' | 'restarting' | 'stopping' | 'none' = 'none') {

    const embed: APIEmbed = {
        title: `\`${app.isWebsite() ? "🌐" : "🤖"}\` | ${app.isWebsite() ? "Website/API" : "Aplicação"} - ${app.name}`,
        description: app.description ? `📖 ${app.description}` : "",
        color: 0x1d4ed8,
        fields: [
            { name: "🏷️ Nome", value: app.name, inline: true },
            { name: "🖥️ Cluster", value: app.cluster.toUpperCase(), inline: true },
            { name: "📚 Linguagem", value: `${languages[app.language as keyof typeof languages] || app.language}`, inline: true },
            { name: `${status.running ? "🟢" : "🔴"} Status`, value: `${status.running ? "Em execução" : "Parado"}`, inline: true },
            { name: "📟 Memória RAM", value: `${status.usage.ram} / ${app.ram.toFixed(2)}MB`, inline: true },
            { name: "🧠 Processamento", value: `${status.usage.cpu}`, inline: true },
            { name: "🌐 Uso de rede (Total)", value: `${status.usage.network.total}`, inline: true },
            { name: "🌐 Uso de rede (Agora)", value: `${status.usage.network.now}`, inline: true },
            { name: "🔖 ID", value: `||\`${app.id}\`||`, inline: true }
        ]
    }

    return { embeds: [embed] }

}
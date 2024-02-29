import { CustomClient } from "../CustomClient"

export interface Application {
    id: string
    name: string
    cluster: string
    ram: number
    is_website: boolean
    language: string
    description: string
    status: {
        ram: string
        cpu: string
        running: boolean,
        uptime: number,
        network: {
            now: string,
            total: string
        }
    },
    logs: string
}

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

export async function get_application(app_id: string, client: CustomClient) {

    const app = await client.square_api.applications.get(app_id || "").catch(() => { });

    if (!app) return null;

    const status = await app.getStatus();
    const logs = await Promise.race([app.getLogs(), new Promise((_, r) => setTimeout(r, 2000))]).catch(() => "") as string;

    return {
        id: app.id,
        name: app.name,
        cluster: app.cluster.toUpperCase(),
        description: app.description,
        logs,
        is_website: app.isWebsite(),
        language: languages[app.language as keyof typeof languages] || app.language,
        ram: app.ram,
        status: {
            cpu: status.usage.cpu,
            network: status.usage.network,
            ram: status.usage.ram,
            running: status.running,
            uptime: status.uptimeTimestamp
        }
    } as Application

}
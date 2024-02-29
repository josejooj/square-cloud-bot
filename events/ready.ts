import { DiscordEvent } from "../interfaces/discord";

const event: DiscordEvent<"ready"> = {
    name: "ready",
    listener: (client) => {
        console.log(`\x1b[32mEstou online como ${client.user.tag}\x1b[0m`);
        console.log(
            `\x1b[32mVocê pode me adicionar a qualquer servidor via: \x1b[35m%s\x1b[0m`,
            `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
        )
    }
}

export default event;
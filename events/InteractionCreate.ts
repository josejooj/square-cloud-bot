import { ModalMessageModalSubmitInteraction } from 'discord.js';
import { DiscordEvent } from '../interfaces/discord';

const event: DiscordEvent<"interactionCreate"> = {
    name: "interactionCreate",
    listener: async (client, int) => {

        try {
            if (int.isChatInputCommand() || int.isAutocomplete()) {

                const command = client.commands[int.commandName];

                if (!command) {
                    if (int.isChatInputCommand()) return int.reply({ embeds: [{ description: `❌ Comando não encontrado internamente!`, footer: { text: int.commandName } }], ephemeral: true });
                    else return int.respond([{ name: `❌ Comando "${int.commandName}" não encontrado internamente!`, value: 'null' }])
                }

                if (int.isChatInputCommand()) return command.handler?.(client, int);
                if (int.isAutocomplete()) return command.auto_complete?.(client, int)

            } else if (int.isButton() || int.isStringSelectMenu() || int.isModalSubmit() || int.isUserSelectMenu()) {

                const task = client.tasks[int.customId.split("-")[0]];
                const data = client.interactions.get(int.message?.id!);

                if (!int.guild || !int.guildId) return;
                if (!task) return int.reply({
                    ephemeral: true,
                    embeds: [{
                        description: "❌ Task não encontrada internamente!",
                        footer: { text: int.customId }
                    }]
                })

                if (!data && !task.dont_need_data) return int.message?.delete().catch(() => {
                    int.reply({
                        embeds: [{ color: 0xFFFF00, description: `❌ Por favor, use o comando novamente.` }],
                        ephemeral: true
                    }).catch(() => { })
                });

                await task.handler(client, int as ModalMessageModalSubmitInteraction, data!);

            }

        } catch (e) {

            console.error(e)

        }
    }
}

export default event;
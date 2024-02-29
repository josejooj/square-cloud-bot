import { AutocompleteInteraction, ButtonInteraction,  ChatInputApplicationCommandData, ChatInputCommandInteraction, ClientEvents, ModalMessageModalSubmitInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { CustomClient } from "../CustomClient";

export type CommandInteraction = ButtonInteraction | StringSelectMenuInteraction | UserSelectMenuInteraction | ModalMessageModalSubmitInteraction

interface Task {
    name: string,
    dont_need_data?: boolean
    handler: (client: CustomClient, int: CommandInteraction, data: any) => any
}

interface Command {
    data: ChatInputApplicationCommandData,
    handler?: (client: CustomClient, int: ChatInputCommandInteraction) => any
    auto_complete?: (client: CustomClient, int: AutocompleteInteraction) => any
}

interface DiscordEvent<T extends keyof ClientEvents> {
    name: T,
    listener: (client: CustomClient, ...args: ClientEvents[T]) => any
}

export {
    Task,
    DiscordEvent,
    Command
}
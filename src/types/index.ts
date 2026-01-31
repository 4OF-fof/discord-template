import type { ChatInputCommandInteraction, Client, ClientEvents, Message } from "discord.js";

export interface Command {
	name: string;
	description: string;
	slash?: boolean;
	mention?: { keywords: string[] };
	message?: { keywords: string[] };
	execute: (interactionOrMessage: ChatInputCommandInteraction | Message) => Promise<void>;
}

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute: (client: Client, ...args: ClientEvents[K]) => void | Promise<void>;
}

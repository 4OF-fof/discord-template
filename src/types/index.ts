import type {
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	Message,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
} from "discord.js";

export interface Command {
	name: string;
	description: string;
	slash?: boolean;
	userContext?: boolean;
	messageContext?: boolean;
	mention?: { keywords: string[] };
	message?: { keywords: string[] };
	execute: (
		interactionOrMessage:
			| ChatInputCommandInteraction
			| UserContextMenuCommandInteraction
			| MessageContextMenuCommandInteraction
			| Message,
	) => Promise<void>;
}

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
	name: K;
	once?: boolean;
	execute: (client: Client, ...args: ClientEvents[K]) => void | Promise<void>;
}

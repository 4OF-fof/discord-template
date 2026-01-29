import type { ChatInputCommandInteraction, Client, Message } from "discord.js";

export interface Command {
  name: string;
  description: string;
  slash?: boolean;
  mention?: { keywords?: string[] };
  message?: { keywords: string[] };
  execute: (
    interactionOrMessage: ChatInputCommandInteraction | Message
  ) => Promise<void>;
}

export interface Event<T = unknown> {
  name: string;
  once?: boolean;
  execute: (client: Client, ...args: T[]) => void | Promise<void>;
}

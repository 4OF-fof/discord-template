import type { ChatInputCommandInteraction, Message } from "discord.js";

export async function executePing(target: ChatInputCommandInteraction | Message): Promise<void> {
  await target.reply({ content: "Pong!" });
}

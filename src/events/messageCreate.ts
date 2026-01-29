import type { Client, Message } from "discord.js";
import type { Event, Command } from "../types";
import { commands, commandOrder } from "../commands";

const sortByOrder = (a: Command, b: Command) =>
  (commandOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER) -
  (commandOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER);

export const messageCreate: Event = {
  name: "messageCreate",
  async execute(client: Client, ...args: unknown[]) {
    const message = args[0] as Message;
    if (message.author.bot) return;
    if (!client.user) return;

    const contentLower = message.content.toLowerCase();

    const executeCommand = async (command: Command) => {
      try {
        await command.execute(message);
      } catch (error) {
        console.error("Error executing command:", error);
        try {
          await message.reply("コマンドの実行中にエラーが発生しました。");
        } catch (replyError) {
          console.error("Failed to send error response:", replyError);
        }
      }
    };

    // Mention-based commands
    if (message.mentions.has(client.user)) {
      const textWithoutMentions = message.content
        .replace(/<@!?\d+>/g, "")
        .trim()
        .toLowerCase();

      const mentionMatches = Array.from(commands.values()).filter((cmd: Command) => {
        const cfg = cmd.mention;
        if (!cfg) return false;
        if (cfg.keywords.length === 0) return true;
        return cfg.keywords.some((kw) => textWithoutMentions.includes(kw.toLowerCase()));
      });

      if (mentionMatches.length > 0) {
        mentionMatches.sort(sortByOrder);
        await executeCommand(mentionMatches[0]);
        return;
      }
    }

    // Message keyword-based commands
    const messageMatches = Array.from(commands.values()).filter((cmd: Command) =>
      Boolean(cmd.message?.keywords.some((kw: string) => contentLower.includes(kw.toLowerCase()))),
    );

    if (messageMatches.length > 0) {
      messageMatches.sort(sortByOrder);
      await executeCommand(messageMatches[0]);
      return;
    }
  },
};

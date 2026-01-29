import type { Client, Message } from "discord.js";
import type { Event } from "../types";
import { commands, commandOrder } from "../commands";

export const messageCreate: Event<Message> = {
  name: "messageCreate",
  async execute(client: Client, message: Message) {
    if (message.author.bot) return;

    const contentLower = message.content.toLowerCase();

    if (message.mentions.has(client.user!)) {
      const textWithoutMentions = message.content.replace(/<@!?\d+>/g, "").trim().toLowerCase();
      const noExtraText = textWithoutMentions.length === 0;

      const mentionMatches = Array.from(commands.values()).filter((command) => {
        const mentionCfg = command.mention;
        if (!mentionCfg) return false;
        if (!mentionCfg.keywords || mentionCfg.keywords.length === 0) return true;
        return (
          noExtraText ||
          mentionCfg.keywords.some((kw) => textWithoutMentions.includes(kw.toLowerCase()))
        );
      });

      if (mentionMatches.length > 0) {
        mentionMatches.sort((a, b) => {
          return (commandOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER) - (commandOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER);
        });
        const command = mentionMatches[0];
        try {
          await command.execute(message);
        } catch (error) {
          console.error("Error executing mention command:", error);
          await message.reply("コマンドの実行中にエラーが発生しました。");
        }
        return;
      }
    }

    // Handle plain message keyword matches: collect all matches and pick by registration order
    const messageMatches = Array.from(commands.values()).filter((command) => {
      if (!command.message) return false;
      return command.message.keywords.some((kw) => contentLower.includes(kw.toLowerCase()));
    });

    if (messageMatches.length > 0) {
      messageMatches.sort((a, b) => {
        return (commandOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER) - (commandOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER);
      });
      const command = messageMatches[0];
      try {
        await command.execute(message);
      } catch (error) {
        console.error("Error executing message command:", error);
        await message.reply("コマンドの実行中にエラーが発生しました。");
      }
      return;
    }
  },
};

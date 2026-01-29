import type { ChatInputCommandInteraction, Client } from "discord.js";
import type { Command, Event } from "../types";

export function createInteractionHandler(
  commands: Map<string, Command>
): Event<ChatInputCommandInteraction> {
  return {
    name: "interactionCreate",
    async execute(_client: Client, interaction: ChatInputCommandInteraction) {
      if (!interaction.isChatInputCommand()) return;

      const command = commands.get(interaction.commandName);
      if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        const errorMessage = "コマンドの実行中にエラーが発生しました。";
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    },
  };
}

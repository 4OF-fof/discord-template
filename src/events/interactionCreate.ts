import type { Client, Interaction, RepliableInteraction } from "discord.js";
import type { Command, Event } from "../types";

async function handleError(interaction: RepliableInteraction, commandName: string, error: unknown) {
	console.error(`Error executing command ${commandName}:`, error);
	const errorMessage = "コマンドの実行中にエラーが発生しました。";
	try {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: errorMessage, ephemeral: true });
		} else {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		}
	} catch (replyError) {
		console.error("Failed to send error response:", replyError);
	}
}

export function createInteractionHandler(commands: Map<string, Command>): Event<"interactionCreate"> {
	return {
		name: "interactionCreate",
		async execute(_client: Client, interaction: Interaction) {
			if (
				!interaction.isChatInputCommand() &&
				!interaction.isUserContextMenuCommand() &&
				!interaction.isMessageContextMenuCommand()
			) {
				return;
			}

			const command = commands.get(interaction.commandName);
			if (!command) {
				console.error(`Command not found: ${interaction.commandName}`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				await handleError(interaction, interaction.commandName, error);
			}
		},
	};
}

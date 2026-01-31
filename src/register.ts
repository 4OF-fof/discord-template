import { env } from "./env";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { commands } from "./commands";

const isRelease = process.argv.includes("--release");

async function registerCommands() {
	const rest = new REST({ version: "10" }).setToken(env.discordToken);

	const commandData = [...commands.values()]
		.filter((cmd) => cmd.slash)
		.map((cmd) =>
			new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON(),
		);

	if (isRelease) {
		console.log("Started refreshing global application (/) commands.");
		await rest.put(Routes.applicationCommands(env.discordClientId), { body: commandData });
		console.log("Successfully reloaded global application (/) commands.");
	} else {
		if (!env.guildId) {
			throw new Error(
				"GUILD_ID must be set for guild-specific registration. Use --release for global registration.",
			);
		}
		console.log(`Started refreshing guild (/) commands for guild ${env.guildId}.`);
		await rest.put(Routes.applicationGuildCommands(env.discordClientId, env.guildId), {
			body: commandData,
		});
		console.log("Successfully reloaded guild (/) commands.");
	}
}

registerCommands().catch(console.error);

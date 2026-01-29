import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { commands } from "./commands";

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  throw new Error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in environment variables");
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token);

  const commandData = [...commands.values()]
    .filter((cmd) => cmd.slash)
    .map((cmd) =>
      new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON(),
    );

  console.log("Started refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(clientId), { body: commandData });
  console.log("Successfully reloaded application (/) commands.");
}

registerCommands().catch(console.error);

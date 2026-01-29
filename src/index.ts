import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { commands } from "./commands";
import { clientReady } from "./events/clientReady.js";
import { messageCreate } from "./events/messageCreate.js";
import { createInteractionHandler } from "./events/interactionCreate.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  throw new Error(
    "DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in environment variables"
  );
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token!);

  const commandData = [...commands.values()]
    .filter((cmd) => cmd.slash)
    .map((cmd) => new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON());

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId!), { body: commandData });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

function registerEvents() {
  const interactionHandler = createInteractionHandler(commands);

  client.once("clientReady", (...args) => clientReady.execute(client, ...args));
  client.on(messageCreate.name, (...args) =>
    messageCreate.execute(client, ...args)
  );
  client.on(interactionHandler.name, (...args) =>
    interactionHandler.execute(client, ...args)
  );
}

async function main() {
  await registerCommands();
  registerEvents();
  await client.login(token);
}

main().catch(console.error);

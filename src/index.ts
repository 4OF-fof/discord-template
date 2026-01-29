import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { commands } from "./commands";
import type { Event } from "./types";
import { clientReady } from "./events/clientReady.js";
import { messageCreate } from "./events/messageCreate.js";
import { createInteractionHandler } from "./events/interactionCreate.js";

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  throw new Error(
    "DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in environment variables"
  );
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function registerCommands(token: string, clientId: string) {
  const rest = new REST({ version: "10" }).setToken(token);

  const commandData = [...commands.values()]
    .filter((cmd) => cmd.slash)
    .map((cmd) => new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON());

  console.log("Started refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(clientId), { body: commandData });
  console.log("Successfully reloaded application (/) commands.");
}

function registerEvents() {
  const interactionHandler = createInteractionHandler(commands);
  const events: Event[] = [clientReady, messageCreate, interactionHandler];

  for (const event of events) {
    const handler = (...args: unknown[]) => event.execute(client, ...args);
    if (event.once) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }
  }
}

async function main() {
  await registerCommands(token, clientId);
  registerEvents();
  await client.login(token);
}

main().catch(console.error);

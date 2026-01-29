import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import type { Event } from "./types";
import { clientReady } from "./events/clientReady.js";
import { messageCreate } from "./events/messageCreate.js";
import { createInteractionHandler } from "./events/interactionCreate.js";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN must be set in environment variables");
}

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

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
  registerEvents();
  await client.login(token);
}

main().catch(console.error);

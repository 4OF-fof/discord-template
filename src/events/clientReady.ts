import type { Client } from "discord.js";
import type { Event } from "../types";

export const clientReady: Event = {
  name: "clientReady",
  once: true,
  execute(client: Client) {
    if (!client.user) {
      console.error("Client user is not available");
      return;
    }
    console.log(`Logged in as ${client.user.tag}`);
  },
};

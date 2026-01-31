import type { Client } from "discord.js";
import type { Event } from "../types";

export const clientReady: Event<"ready"> = {
	name: "ready",
	once: true,
	execute(_client: Client, readyClient: Client<true>) {
		console.log(`Logged in as ${readyClient.user.tag}`);
	},
};

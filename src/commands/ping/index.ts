import type { Command } from "../../types";
import { executePing } from "./executePing.js";

export const ping: Command = {
  name: "ping",
  description: "Botの応答を確認します",
  slash: true,

  mention: { keywords: ["ping"] },
  message: { keywords: ["ping"] },

  execute: executePing,
};

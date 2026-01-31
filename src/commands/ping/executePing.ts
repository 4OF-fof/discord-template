import type { Command } from "../../types";

export const executePing: Command["execute"] = async (target) => {
  await target.reply({ content: "Pong!" });
};

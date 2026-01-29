import { describe, it, expect, vi } from "vitest";
import { executePing } from "../../src/commands/ping/executePing.js";

describe("executePing handler", () => {
  it("should reply with Pong! for interaction", async () => {
    const mockReply = vi.fn().mockResolvedValue(undefined);
    const mockFetchReply = vi.fn();
    const mockEditReply = vi.fn();

    const mockInteraction = {
      createdTimestamp: 900,
      client: { ws: { ping: 50 } },
      reply: mockReply,
      fetchReply: mockFetchReply,
      editReply: mockEditReply,
      isChatInputCommand: () => true,
    } as any;

    await executePing(mockInteraction);

    expect(mockReply).toHaveBeenCalledWith({ content: "Pong!" });
    expect(mockFetchReply).not.toHaveBeenCalled();
    expect(mockEditReply).not.toHaveBeenCalled();
  });

  it("should reply with Pong! for a message", async () => {
    const mockReply = vi.fn().mockResolvedValue(undefined);
    const mockMessage = {
      createdTimestamp: Date.now(),
      reply: mockReply,
    } as any;

    await executePing(mockMessage);

    expect(mockReply).toHaveBeenCalledWith({ content: "Pong!" });
  });
});

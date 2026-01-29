import { describe, it, expect, vi } from "vitest";
import { createInteractionHandler } from "../../src/events/interactionCreate.js";
import type { Command } from "../../src/types/index.js";

function createMockCommand(overrides: Partial<Command> = {}): Command {
  return {
    name: "test",
    description: "test command",
    execute: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockInteraction(overrides: Record<string, unknown> = {}) {
  return {
    isChatInputCommand: () => true,
    commandName: "test",
    replied: false,
    deferred: false,
    reply: vi.fn().mockResolvedValue(undefined),
    followUp: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as any;
}

describe("interactionCreate event", () => {
  it("should execute the matching command", async () => {
    const cmd = createMockCommand();
    const commands = new Map([["test", cmd]]);
    const handler = createInteractionHandler(commands);
    const interaction = createMockInteraction();

    await handler.execute({} as any, interaction);

    expect(cmd.execute).toHaveBeenCalledWith(interaction);
  });

  it("should ignore non-chat-input interactions", async () => {
    const cmd = createMockCommand();
    const commands = new Map([["test", cmd]]);
    const handler = createInteractionHandler(commands);
    const interaction = createMockInteraction({
      isChatInputCommand: () => false,
    });

    await handler.execute({} as any, interaction);

    expect(cmd.execute).not.toHaveBeenCalled();
  });

  it("should log error for unknown command", async () => {
    const commands = new Map<string, Command>();
    const handler = createInteractionHandler(commands);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const interaction = createMockInteraction({ commandName: "unknown" });

    await handler.execute({} as any, interaction);

    expect(consoleSpy).toHaveBeenCalledWith("Command not found: unknown");
    consoleSpy.mockRestore();
  });

  it("should reply with error message when command throws", async () => {
    const cmd = createMockCommand({
      execute: vi.fn().mockRejectedValue(new Error("fail")),
    });
    const commands = new Map([["test", cmd]]);
    const handler = createInteractionHandler(commands);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const interaction = createMockInteraction();

    await handler.execute({} as any, interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "コマンドの実行中にエラーが発生しました。",
      ephemeral: true,
    });
    consoleSpy.mockRestore();
  });

  it("should use followUp when already replied", async () => {
    const cmd = createMockCommand({
      execute: vi.fn().mockRejectedValue(new Error("fail")),
    });
    const commands = new Map([["test", cmd]]);
    const handler = createInteractionHandler(commands);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const interaction = createMockInteraction({ replied: true });

    await handler.execute({} as any, interaction);

    expect(interaction.followUp).toHaveBeenCalledWith({
      content: "コマンドの実行中にエラーが発生しました。",
      ephemeral: true,
    });
    expect(interaction.reply).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

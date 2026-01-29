import { describe, it, expect, vi } from "vitest";
import { clientReady } from "../../src/events/clientReady.js";

describe("clientReady event", () => {
  it("should log the bot tag on ready", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const mockClient = {
      user: { tag: "TestBot#1234" },
    } as any;

    clientReady.execute(mockClient);

    expect(consoleSpy).toHaveBeenCalledWith("Logged in as TestBot#1234");
    consoleSpy.mockRestore();
  });

  it("should have once set to true", () => {
    expect(clientReady.once).toBe(true);
  });

  it("should handle missing user gracefully", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const mockClient = { user: undefined } as any;

    clientReady.execute(mockClient);

    expect(consoleSpy).toHaveBeenCalledWith("Logged in as undefined");
    consoleSpy.mockRestore();
  });
});

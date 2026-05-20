import { describe, expect, it, vi } from "vitest";
import { browser } from "wxt/browser";
import {
  broadcastToActiveTabs,
  onMessage,
  sendMessage,
  sendToTab,
} from "@/lib/messaging";

describe("lib/messaging", () => {
  it("sendMessage forwards payload to browser.runtime.sendMessage", async () => {
    await sendMessage({ type: "toggleContent" });
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
      type: "toggleContent",
    });
  });

  it("sendToTab forwards to the right tab id", async () => {
    await sendToTab(42, { type: "toggleContent" });
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(42, {
      type: "toggleContent",
    });
  });

  it("broadcastToActiveTabs only sends to tabs with an id", async () => {
    vi.mocked(browser.tabs.query).mockResolvedValueOnce([
      { id: 1, windowId: 1 },
      { id: undefined, windowId: 1 },
      { id: 3, windowId: 1 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);
    await broadcastToActiveTabs({ type: "toggleContent" });
    expect(browser.tabs.sendMessage).toHaveBeenCalledTimes(2);
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(1, {
      type: "toggleContent",
    });
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(3, {
      type: "toggleContent",
    });
  });

  it("onMessage returns an unsubscribe", () => {
    const handler = vi.fn();
    const unsubscribe = onMessage(handler);
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
    // re-calling unsubscribe should be safe
    unsubscribe();
  });
});

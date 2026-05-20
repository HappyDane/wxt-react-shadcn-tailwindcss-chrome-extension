import { browser } from "wxt/browser";
import { broadcastToActiveTabs, type ExtMessage } from "@/lib/messaging";
import { log } from "@/lib/logger";

export default defineBackground(() => {
  // Keyboard-driven actions (declared in wxt.config.ts → manifest.commands).
  browser.commands.onCommand.addListener(async (command) => {
    if (command === "open-side-panel") {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.windowId !== undefined) {
        // @ts-expect-error - sidePanel API not in all browser typings yet
        await browser.sidePanel
          .open({ windowId: tab.windowId })
          .catch((e: unknown) => log.error("sidePanel.open failed", e));
      }
    } else if (command === "toggle-content") {
      await broadcastToActiveTabs({ type: "toggleContent" });
    }
  });

  // Forward imperative messages (e.g. from the popup) to active-tab content
  // scripts. State sync messages no longer flow through here — see
  // lib/store.ts; storage.onChanged keeps every surface in sync.
  browser.runtime.onMessage.addListener(async (raw: unknown) => {
    const message = raw as ExtMessage;
    if (message.type === "toggleContent") {
      await broadcastToActiveTabs(message);
    }
  });
});

import { browser } from "wxt/browser";
import { broadcastToActiveTabs, type ExtMessage } from "@/lib/messaging";

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
        await browser.sidePanel.open({ windowId: tab.windowId });
      }
    } else if (command === "toggle-content") {
      await broadcastToActiveTabs({ type: "toggleContent" });
    }
  });

  // Forward theme / locale changes and content toggles from any extension
  // context (popup, options, side panel) to active-tab content scripts so
  // their UI re-renders in sync.
  browser.runtime.onMessage.addListener(async (raw: unknown) => {
    const message = raw as ExtMessage;
    if (
      message.type === "changeTheme" ||
      message.type === "changeThemePreset" ||
      message.type === "changeLocale" ||
      message.type === "toggleContent"
    ) {
      await broadcastToActiveTabs(message);
    }
  });
});

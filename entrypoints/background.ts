import { browser } from "wxt/browser";
import {
  broadcastToActiveTabs,
  sendToTab,
  type ExtMessage,
} from "@/lib/messaging";

export default defineBackground(() => {
  // Open the side panel when the extension icon is clicked.
  // @ts-expect-error - sidePanel API is not in all browser typings yet
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    // eslint-disable-next-line no-console
    .catch((error: unknown) => console.error(error));

  // Also notify the active tab's content script so it can toggle its UI.
  browser.action.onClicked.addListener((tab) => {
    if (tab.id !== undefined) {
      void sendToTab(tab.id, { type: "clickExtIcon" });
    }
  });

  // Forward theme / locale changes from the side panel to the active tab so
  // the content-script UI re-renders in sync.
  browser.runtime.onMessage.addListener(async (raw: unknown) => {
    const message = raw as ExtMessage;
    if (message.type === "changeTheme" || message.type === "changeLocale") {
      await broadcastToActiveTabs(message);
    }
  });
});

import { browser } from "wxt/browser";
import { MessageType, type ExtMessage } from "@/lib/messaging";

export default defineBackground(() => {
  // Open the side panel when the extension icon is clicked.
  // @ts-expect-error - sidePanel API is not in all browser typings yet
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    // eslint-disable-next-line no-console
    .catch((error: unknown) => console.error(error));

  // Also notify the content script so it can toggle its in-page UI.
  browser.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    browser.tabs.sendMessage(tab.id, {
      messageType: MessageType.clickExtIcon,
    } satisfies ExtMessage);
  });

  // Broadcast theme / locale changes from the side panel to active tabs so
  // content scripts can re-render in sync.
  browser.runtime.onMessage.addListener(async (message: ExtMessage) => {
    if (
      message.messageType === MessageType.changeTheme ||
      message.messageType === MessageType.changeLocale
    ) {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      await Promise.all(
        tabs
          .filter((t): t is typeof t & { id: number } => t.id !== undefined)
          .map((t) => browser.tabs.sendMessage(t.id, message))
      );
    }
  });
});

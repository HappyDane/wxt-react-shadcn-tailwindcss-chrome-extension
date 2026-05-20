import { browser } from "wxt/browser";
import type { ThemeMode } from "@/lib/storage";

/**
 * Typed, discriminated-union message protocol for all IPC inside the
 * extension. Add a new variant here and exhaustiveness checks will guide
 * the rest of the codebase.
 */
export type ExtMessage =
  | { type: "clickExtIcon" }
  | { type: "changeTheme"; theme: ThemeMode }
  | { type: "changeLocale"; locale: string };

export type ExtMessageType = ExtMessage["type"];

/** Send a message to the background / other extension contexts. */
export function sendMessage(message: ExtMessage): Promise<unknown> {
  return browser.runtime.sendMessage(message);
}

/** Send a message to a specific tab's content script. */
export function sendToTab(
  tabId: number,
  message: ExtMessage
): Promise<unknown> {
  return browser.tabs.sendMessage(tabId, message);
}

/** Broadcast a message to all active tabs in the current window. */
export async function broadcastToActiveTabs(
  message: ExtMessage
): Promise<void> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  await Promise.all(
    tabs
      .filter((t): t is typeof t & { id: number } => t.id !== undefined)
      .map((t) => browser.tabs.sendMessage(t.id, message).catch(() => {}))
  );
}

/**
 * Subscribe to incoming messages. Returns an unsubscribe function suitable
 * for React `useEffect` cleanup.
 */
export function onMessage(handler: (message: ExtMessage) => void): () => void {
  const listener = (raw: unknown) => {
    handler(raw as ExtMessage);
  };
  browser.runtime.onMessage.addListener(listener);
  return () => browser.runtime.onMessage.removeListener(listener);
}

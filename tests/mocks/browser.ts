/**
 * Lightweight in-memory mock of the subset of the `wxt/browser` /
 * WebExtension API that this template exercises. Stateful between calls,
 * reset between tests via the global `beforeEach` hook in tests/setup.ts.
 */
import { vi } from "vitest";

type StorageChange = { newValue?: unknown; oldValue?: unknown };
type StorageListener = (
  changes: Record<string, StorageChange>,
  area: string
) => void;
type MessageListener = (
  message: unknown,
  sender: unknown,
  sendResponse: (r: unknown) => void
) => void;
type CommandListener = (command: string) => void;

const state = {
  storage: new Map<string, unknown>(),
  storageListeners: new Set<StorageListener>(),
  messageListeners: new Set<MessageListener>(),
  commandListeners: new Set<CommandListener>(),
};

export function resetBrowserMock(): void {
  state.storage.clear();
  state.storageListeners.clear();
  state.messageListeners.clear();
  state.commandListeners.clear();
}

/** Manually trigger a storage change (e.g. from another extension surface). */
export function emitStorageChange(
  patch: Record<string, unknown>,
  area = "local"
): void {
  const changes: Record<string, StorageChange> = {};
  for (const [k, v] of Object.entries(patch)) {
    changes[k] = { newValue: v, oldValue: state.storage.get(k) };
    state.storage.set(k, v);
  }
  for (const l of state.storageListeners) l(changes, area);
}

export const browser = {
  runtime: {
    id: "test-extension",
    sendMessage: vi.fn(async (_message: unknown) => undefined),
    onMessage: {
      addListener: (fn: MessageListener) => state.messageListeners.add(fn),
      removeListener: (fn: MessageListener) =>
        state.messageListeners.delete(fn),
    },
    openOptionsPage: vi.fn(),
  },
  storage: {
    local: {
      get: vi.fn(async (key: string | string[] | null) => {
        if (key === null || key === undefined) {
          return Object.fromEntries(state.storage);
        }
        const keys = Array.isArray(key) ? key : [key];
        const out: Record<string, unknown> = {};
        for (const k of keys) {
          if (state.storage.has(k)) out[k] = state.storage.get(k);
        }
        return out;
      }),
      set: vi.fn(async (obj: Record<string, unknown>) => {
        emitStorageChange(obj);
      }),
      remove: vi.fn(async (key: string | string[]) => {
        const keys = Array.isArray(key) ? key : [key];
        const changes: Record<string, StorageChange> = {};
        for (const k of keys) {
          changes[k] = { oldValue: state.storage.get(k) };
          state.storage.delete(k);
        }
        for (const l of state.storageListeners) l(changes, "local");
      }),
      clear: vi.fn(async () => {
        state.storage.clear();
      }),
    },
    onChanged: {
      addListener: (fn: StorageListener) => state.storageListeners.add(fn),
      removeListener: (fn: StorageListener) =>
        state.storageListeners.delete(fn),
    },
  },
  tabs: {
    query: vi.fn(async () => [] as { id?: number; windowId?: number }[]),
    sendMessage: vi.fn(async (_tabId: number, _message: unknown) => undefined),
  },
  commands: {
    onCommand: {
      addListener: (fn: CommandListener) => state.commandListeners.add(fn),
      removeListener: (fn: CommandListener) =>
        state.commandListeners.delete(fn),
    },
  },
  action: {
    onClicked: {
      addListener: vi.fn(),
    },
  },
};

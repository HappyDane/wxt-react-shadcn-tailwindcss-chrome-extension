import { useEffect } from "react";
import { browser } from "wxt/browser";
import { create } from "zustand";
import { log } from "@/lib/logger";
import {
  getStored,
  setStored,
  type ThemeMode,
  type ThemePreset,
} from "@/lib/storage";

/**
 * App-wide state shared across every extension surface (popup, side panel,
 * options, content script). State is mirrored to `browser.storage.local`
 * and a `storage.onChanged` listener pushes updates back into the store,
 * so two open surfaces stay in sync without any explicit messaging.
 *
 * Usage:
 *   const theme = useAppStore((s) => s.theme);
 *   useAppStore.getState().setTheme("dark");
 *   useStoreHydration(); // call once near the root of each entrypoint
 */

export interface AppState {
  theme: ThemeMode;
  themePreset: ThemePreset;
  locale: string | null;
  hydrated: boolean;

  setTheme: (theme: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setLocale: (locale: string) => void;

  /** Internal: applied by useStoreHydration / storage listener. */
  _applyFromStorage: (patch: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "system",
  themePreset: "violet",
  locale: null,
  hydrated: false,

  setTheme: (theme) => {
    set({ theme });
    void setStored("theme", theme);
  },
  setThemePreset: (themePreset) => {
    set({ themePreset });
    void setStored("themePreset", themePreset);
  },
  setLocale: (locale) => {
    set({ locale });
    void setStored("locale", locale);
  },

  _applyFromStorage: (patch) => set(patch),
}));

/**
 * Hydrates the store from `browser.storage.local` and subscribes to
 * `storage.onChanged` so the store reflects writes made by other extension
 * surfaces. Returns the `hydrated` flag — render a fallback until it's
 * true if you need to avoid a flash of default state.
 */
export function useStoreHydration(): boolean {
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getStored("theme"),
      getStored("themePreset"),
      getStored("locale"),
    ])
      .then(([theme, themePreset, locale]) => {
        if (cancelled) return;
        useAppStore.getState()._applyFromStorage({
          ...(theme && { theme }),
          ...(themePreset && { themePreset }),
          ...(locale && { locale }),
          hydrated: true,
        });
      })
      .catch((e) => log.error("store hydration failed", e));

    const onChanged = (
      changes: Record<string, { newValue?: unknown }>,
      area: string
    ) => {
      if (area !== "local") return;
      const patch: Partial<AppState> = {};
      if (changes.theme && changes.theme.newValue !== undefined) {
        patch.theme = changes.theme.newValue as ThemeMode;
      }
      if (changes.themePreset && changes.themePreset.newValue !== undefined) {
        patch.themePreset = changes.themePreset.newValue as ThemePreset;
      }
      // Legacy storage key for locale.
      if (changes.i18n && changes.i18n.newValue !== undefined) {
        patch.locale = changes.i18n.newValue as string;
      }
      if (Object.keys(patch).length > 0) {
        useAppStore.getState()._applyFromStorage(patch);
      }
    };

    browser.storage.onChanged.addListener(onChanged);
    return () => {
      cancelled = true;
      browser.storage.onChanged.removeListener(onChanged);
    };
  }, []);

  return hydrated;
}

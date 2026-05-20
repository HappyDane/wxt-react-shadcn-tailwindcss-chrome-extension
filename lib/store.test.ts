import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { browser } from "wxt/browser";
import { emitStorageChange } from "../tests/mocks/browser";
import { useAppStore, useStoreHydration } from "@/lib/store";

function resetStore() {
  useAppStore.setState({
    theme: "system",
    themePreset: "violet",
    locale: null,
    hydrated: false,
  });
}

describe("lib/store", () => {
  it("setTheme updates state and persists to storage", async () => {
    resetStore();
    useAppStore.getState().setTheme("dark");
    expect(useAppStore.getState().theme).toBe("dark");
    // Microtask flush so the async setStored resolves.
    await Promise.resolve();
    expect(browser.storage.local.set).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("setLocale uses the legacy 'i18n' storage key", async () => {
    resetStore();
    useAppStore.getState().setLocale("zh_CN");
    expect(useAppStore.getState().locale).toBe("zh_CN");
    await Promise.resolve();
    expect(browser.storage.local.set).toHaveBeenCalledWith({ i18n: "zh_CN" });
  });

  it("useStoreHydration loads values from storage and flips the flag", async () => {
    resetStore();
    await browser.storage.local.set({
      theme: "dark",
      themePreset: "rose",
      i18n: "en",
    });
    const { result } = renderHook(() => useStoreHydration());
    await waitFor(() => expect(result.current).toBe(true));
    const state = useAppStore.getState();
    expect(state.theme).toBe("dark");
    expect(state.themePreset).toBe("rose");
    expect(state.locale).toBe("en");
  });

  it("syncs updates from storage.onChanged (e.g. another extension surface)", async () => {
    resetStore();
    const { result } = renderHook(() => useStoreHydration());
    await waitFor(() => expect(result.current).toBe(true));

    act(() => {
      emitStorageChange({ theme: "light", themePreset: "green" });
    });
    expect(useAppStore.getState().theme).toBe("light");
    expect(useAppStore.getState().themePreset).toBe("green");
  });
});

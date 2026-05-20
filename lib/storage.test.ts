import { describe, expect, it } from "vitest";
import { browser } from "wxt/browser";
import { getStored, setStored } from "@/lib/storage";

describe("lib/storage", () => {
  it("set + get roundtrips a theme", async () => {
    await setStored("theme", "dark");
    expect(await getStored("theme")).toBe("dark");
  });

  it("returns undefined for an unset key", async () => {
    expect(await getStored("themePreset")).toBeUndefined();
  });

  it("locale is stored under the legacy 'i18n' key", async () => {
    await setStored("locale", "zh_CN");
    const raw = await browser.storage.local.get("i18n");
    expect(raw.i18n).toBe("zh_CN");
    expect(await getStored("locale")).toBe("zh_CN");
  });
});

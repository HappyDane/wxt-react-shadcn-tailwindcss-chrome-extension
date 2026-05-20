import { browser } from "wxt/browser";

export type ThemeMode = "light" | "dark" | "system";

export interface StorageSchema {
  theme: ThemeMode;
  locale: string;
}

const KEY: { [K in keyof StorageSchema]: string } = {
  theme: "theme",
  // legacy key kept for backwards compat with v0 installs
  locale: "i18n",
};

export async function getStored<K extends keyof StorageSchema>(
  key: K
): Promise<StorageSchema[K] | undefined> {
  const data = await browser.storage.local.get(KEY[key]);
  return data[KEY[key]] as StorageSchema[K] | undefined;
}

export async function setStored<K extends keyof StorageSchema>(
  key: K,
  value: StorageSchema[K]
): Promise<void> {
  await browser.storage.local.set({ [KEY[key]]: value });
}

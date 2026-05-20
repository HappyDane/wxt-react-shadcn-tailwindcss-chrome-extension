import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";

/**
 * Keeps `react-i18next` in sync with the locale stored in `useAppStore`.
 * Mount once near the root of each entrypoint that renders translated UI.
 */
export function useSyncI18n(): void {
  const { i18n } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);
}

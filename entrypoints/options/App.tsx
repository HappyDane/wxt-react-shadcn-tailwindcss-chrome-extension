import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../assets/main.css";
import { SettingsPage } from "@/components/app/settings-page";
import { ThemeRoot } from "@/components/app/theme-root";
import { useTheme } from "@/components/theme-provider";
import { onMessage } from "@/lib/messaging";
import { getStored } from "@/lib/storage";

export default function App() {
  const { setTheme, setPreset } = useTheme();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    getStored("locale").then((locale) => {
      if (locale) void i18n.changeLanguage(locale);
    });
  }, [i18n]);

  useEffect(() => {
    return onMessage((message) => {
      if (message.type === "changeLocale") {
        void i18n.changeLanguage(message.locale);
      } else if (message.type === "changeTheme") {
        setTheme(message.theme);
      } else if (message.type === "changeThemePreset") {
        setPreset(message.preset);
      }
    });
  }, [i18n, setTheme, setPreset]);

  return (
    <ThemeRoot>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="mb-6 text-2xl font-bold">{t("settings")}</h1>
          <SettingsPage />
        </div>
      </div>
    </ThemeRoot>
  );
}

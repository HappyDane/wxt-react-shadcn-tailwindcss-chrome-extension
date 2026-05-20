import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { browser } from "wxt/browser";
import { ExternalLink, PanelRightOpen, Settings2, Eye } from "lucide-react";
import "../../assets/main.css";
import { Button } from "@/components/ui/button";
import { ThemeRoot } from "@/components/app/theme-root";
import { useTheme } from "@/components/theme-provider";
import languages from "@/components/i18nConfig";
import { sendMessage } from "@/lib/messaging";
import { getStored, setStored, type ThemeMode } from "@/lib/storage";

const THEMES: ThemeMode[] = ["light", "dark", "system"];

export default function App() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getStored("locale").then((locale) => {
      if (locale) void i18n.changeLanguage(locale);
    });
  }, [i18n]);

  const openSidePanel = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.windowId === undefined) return;
    // @ts-expect-error - sidePanel API not in all browser typings yet
    await browser.sidePanel.open({ windowId: tab.windowId });
    window.close();
  };

  const toggleContent = async () => {
    await sendMessage({ type: "toggleContent" });
    window.close();
  };

  const openOptions = () => {
    browser.runtime.openOptionsPage();
    window.close();
  };

  const onThemeChange = (next: ThemeMode) => {
    setTheme(next);
    void sendMessage({ type: "changeTheme", theme: next });
  };

  const onLocaleChange = async (locale: string) => {
    await i18n.changeLanguage(locale);
    await setStored("locale", locale);
    await sendMessage({ type: "changeLocale", locale });
  };

  return (
    <ThemeRoot>
      <div className="flex flex-col gap-3 bg-background p-4 text-foreground">
        <h1 className="text-base font-semibold">{t("extName", "Extension")}</h1>

        <div className="flex flex-col gap-2">
          <Button
            onClick={openSidePanel}
            className="w-full justify-start gap-2"
          >
            <PanelRightOpen className="h-4 w-4" />
            {t("openSidePanel")}
          </Button>
          <Button
            onClick={toggleContent}
            variant="secondary"
            className="w-full justify-start gap-2"
          >
            <Eye className="h-4 w-4" />
            {t("toggleContent")}
          </Button>
          <Button
            onClick={openOptions}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {t("openOptions")}
            <ExternalLink className="ml-auto h-3 w-3" />
          </Button>
        </div>

        <hr className="border-border" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("theme")}</span>
          <div className="flex gap-1">
            {THEMES.map((opt) => (
              <Button
                key={opt}
                size="sm"
                variant={theme === opt ? "default" : "outline"}
                onClick={() => onThemeChange(opt)}
                className="h-7 px-2 text-xs capitalize"
              >
                {t(`theme.${opt}`, opt)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("language")}</span>
          <div className="flex gap-1">
            {languages.map((lang) => (
              <Button
                key={lang.locale}
                size="sm"
                variant={i18n.language === lang.locale ? "default" : "outline"}
                onClick={() => void onLocaleChange(lang.locale)}
                className="h-7 px-2 text-xs"
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ThemeRoot>
  );
}

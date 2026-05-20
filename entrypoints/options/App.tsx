import { useTranslation } from "react-i18next";
import "../../assets/main.css";
import { SettingsPage } from "@/components/app/settings-page";
import { ThemeRoot } from "@/components/app/theme-root";
import { useSyncI18n } from "@/components/app/use-sync-i18n";

export default function App() {
  useSyncI18n();
  const { t } = useTranslation();

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

import { ThemeSettings } from "@/components/settings/theme-settings";
import { I18nSettings } from "@/components/settings/i18n-settings";

export function SettingsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <I18nSettings />
      <ThemeSettings />
    </div>
  );
}

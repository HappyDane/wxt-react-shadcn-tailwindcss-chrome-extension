import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { PresetSettings } from "@/components/settings/preset-settings";
import { I18nSettings } from "@/components/settings/i18n-settings";

/**
 * Add a new section by appending a `<TabsTrigger>` + `<TabsContent>` pair
 * and a matching `settingsTab.<id>` locale key. Sections are independent
 * cards arranged in a responsive grid.
 */
const TABS = [
  {
    id: "general",
    sections: [I18nSettings],
  },
  {
    id: "appearance",
    sections: [ThemeSettings, PresetSettings],
  },
] as const;

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue={TABS[0].id} className="w-full">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {t(`settingsTab.${tab.id}`, tab.id)}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tab.sections.map((Section, i) => (
              <Section key={i} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

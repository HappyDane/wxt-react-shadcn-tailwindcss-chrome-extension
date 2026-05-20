import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/theme-provider";
import type { ThemeMode } from "@/lib/storage";

const THEMES: ThemeMode[] = ["light", "dark", "system"];

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      <div className="space-y-1.5 p-6 pb-3">
        <h3 className="text-left text-base font-semibold">
          {t("themeSettings")}
        </h3>
      </div>
      <RadioGroup
        value={theme}
        onValueChange={(v) => setTheme(v as ThemeMode)}
        className="p-6 pt-2"
      >
        {THEMES.map((option) => (
          <div
            key={option}
            className="flex items-center justify-between space-y-1.5"
          >
            <Label htmlFor={`theme-${option}`} className="capitalize">
              {t(`theme.${option}`, option)}
            </Label>
            <RadioGroupItem value={option} id={`theme-${option}`} />
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
}

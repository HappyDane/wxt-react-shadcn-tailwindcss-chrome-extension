import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { THEME_PRESETS, type ThemePreset } from "@/lib/storage";
import { cn } from "@/lib/utils";

const SWATCH: Record<ThemePreset, string> = {
  violet: "bg-violet-500",
  zinc: "bg-zinc-900",
  green: "bg-green-600",
  rose: "bg-rose-600",
};

export function PresetSettings() {
  const { preset, setPreset } = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      <div className="space-y-1.5 p-6 pb-3">
        <h3 className="text-left text-base font-semibold">
          {t("presetSettings")}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-6 pt-2">
        {THEME_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPreset(p)}
            aria-pressed={preset === p}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
              preset === p
                ? "border-primary bg-accent"
                : "border-border hover:bg-accent"
            )}
          >
            <span
              className={cn("h-4 w-4 rounded-full", SWATCH[p])}
              aria-hidden
            />
            <span className="capitalize">{t(`preset.${p}`, p)}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

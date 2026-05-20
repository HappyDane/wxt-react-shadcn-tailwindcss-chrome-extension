import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import languages from "@/components/i18nConfig";
import { sendMessage } from "@/lib/messaging";
import { setStored } from "@/lib/storage";

export function I18nSettings() {
  const { t, i18n } = useTranslation();

  const onChange = async (locale: string) => {
    await i18n.changeLanguage(locale);
    await setStored("locale", locale);
    await sendMessage({ type: "changeLocale", locale });
  };

  return (
    <Card>
      <div className="space-y-1.5 p-6 pb-3">
        <h3 className="text-left text-base font-semibold">
          {t("i18nSettings")}
        </h3>
      </div>
      <RadioGroup
        value={i18n.language}
        onValueChange={(v) => void onChange(v)}
        className="p-6 pt-2"
      >
        {languages.map((language) => (
          <div
            key={language.locale}
            className="flex items-center justify-between space-y-1.5"
          >
            <Label htmlFor={`locale-${language.locale}`}>{language.name}</Label>
            <RadioGroupItem
              value={language.locale}
              id={`locale-${language.locale}`}
            />
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
}

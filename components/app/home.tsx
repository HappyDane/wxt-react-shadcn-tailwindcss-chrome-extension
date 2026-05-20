import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

const REFERENCES = [
  { name: "WXT", url: "https://wxt.dev/" },
  { name: "React", url: "https://react.dev/" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com/" },
];

export function Home() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            {t("introduce")}
          </h3>
          <p className="max-w-lg text-balance text-sm leading-relaxed">
            {t("description")}
          </p>
        </div>
      </Card>
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            {t("reference")}
          </h3>
          <div className="flex flex-col gap-4 pt-2">
            {REFERENCES.map((ref) => (
              <div key={ref.url} className="grid gap-1">
                <p className="text-sm font-medium leading-none">{ref.name}</p>
                <a
                  className="text-sm text-muted-foreground hover:underline"
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ref.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export function Header({ title }: { title: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-10 w-full items-center justify-start border-b p-4 text-2xl font-bold text-card-foreground">
      {t(title)}
    </div>
  );
}

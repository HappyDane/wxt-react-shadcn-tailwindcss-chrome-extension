import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/app/header";
import { Home } from "@/components/app/home";
import { SettingsPage } from "@/components/app/settings-page";
import { Sidebar, type SidebarType } from "@/components/app/sidebar";
import { useTheme } from "@/components/theme-provider";
import { onMessage } from "@/lib/messaging";
import { getStored } from "@/lib/storage";

interface AppShellProps {
  onClose?: () => void;
}

export function AppShell({ onClose }: AppShellProps) {
  const [active, setActive] = useState<SidebarType>("home");
  const { i18n } = useTranslation();
  const { setTheme } = useTheme();

  useEffect(() => {
    return onMessage((message) => {
      if (message.type === "changeLocale") {
        void i18n.changeLanguage(message.locale);
      } else if (message.type === "changeTheme") {
        setTheme(message.theme);
      }
    });
  }, [i18n, setTheme]);

  useEffect(() => {
    getStored("locale").then((locale) => {
      if (locale) void i18n.changeLanguage(locale);
    });
  }, [i18n]);

  return (
    <>
      <Header title={active} />
      <Sidebar active={active} onNavigate={setActive} onClose={onClose} />
      <main className="mr-14 grid gap-4 p-4">
        {active === "home" && <Home />}
        {active === "settings" && <SettingsPage />}
      </main>
    </>
  );
}

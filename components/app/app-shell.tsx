import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { browser } from "wxt/browser";
import { Header } from "@/components/app/header";
import { Home } from "@/components/app/home";
import { SettingsPage } from "@/components/app/settings-page";
import { Sidebar, type SidebarType } from "@/components/app/sidebar";
import { useTheme } from "@/components/theme-provider";
import { MessageType, type ExtMessage } from "@/lib/messaging";

interface AppShellProps {
  onClose?: () => void;
}

export function AppShell({ onClose }: AppShellProps) {
  const [active, setActive] = useState<SidebarType>("home");
  const { i18n } = useTranslation();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const listener = (message: ExtMessage) => {
      if (message.messageType === MessageType.changeLocale && message.content) {
        i18n.changeLanguage(message.content);
      } else if (
        message.messageType === MessageType.changeTheme &&
        message.content
      ) {
        toggleTheme(message.content);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, [i18n, toggleTheme]);

  useEffect(() => {
    browser.storage.local.get("i18n").then((data) => {
      if (data.i18n) i18n.changeLanguage(data.i18n as string);
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

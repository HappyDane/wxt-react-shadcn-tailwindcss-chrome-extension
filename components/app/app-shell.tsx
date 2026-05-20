import { useState } from "react";
import { Header } from "@/components/app/header";
import { Home } from "@/components/app/home";
import { SettingsPage } from "@/components/app/settings-page";
import { Sidebar, type SidebarType } from "@/components/app/sidebar";
import { useSyncI18n } from "@/components/app/use-sync-i18n";

interface AppShellProps {
  onClose?: () => void;
}

export function AppShell({ onClose }: AppShellProps) {
  const [active, setActive] = useState<SidebarType>("home");
  useSyncI18n();

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

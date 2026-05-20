import { useEffect, useState } from "react";
import "../../assets/main.css";
import { browser } from "wxt/browser";
import { AppShell } from "@/components/app/app-shell";
import { useTheme } from "@/components/theme-provider";
import { MessageType, type ExtMessage } from "@/lib/messaging";

export default function App() {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const listener = (message: ExtMessage) => {
      if (message.messageType === MessageType.clickExtIcon) {
        setVisible((v) => !v);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  if (!visible) return null;

  return (
    <div className={theme}>
      <div className="fixed right-0 top-0 z-[1000000] h-screen w-[400px] rounded-l-xl bg-background shadow-2xl">
        <AppShell onClose={() => setVisible(false)} />
      </div>
    </div>
  );
}

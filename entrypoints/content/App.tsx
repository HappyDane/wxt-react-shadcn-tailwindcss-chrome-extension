import { useEffect, useState } from "react";
import "../../assets/main.css";
import { AppShell } from "@/components/app/app-shell";
import { useTheme } from "@/components/theme-provider";
import { onMessage } from "@/lib/messaging";

export default function App() {
  const [visible, setVisible] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    return onMessage((message) => {
      if (message.type === "toggleContent") {
        setVisible((v) => !v);
      }
    });
  }, []);

  if (!visible) return null;

  return (
    <div className={resolvedTheme}>
      <div className="fixed right-0 top-0 z-[1000000] h-screen w-[400px] rounded-l-xl bg-background shadow-2xl">
        <AppShell onClose={() => setVisible(false)} />
      </div>
    </div>
  );
}

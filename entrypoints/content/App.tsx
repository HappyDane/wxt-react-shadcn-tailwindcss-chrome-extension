import { useEffect, useState } from "react";
import "../../assets/main.css";
import { AppShell } from "@/components/app/app-shell";
import { ThemeRoot } from "@/components/app/theme-root";
import { onMessage } from "@/lib/messaging";

export default function App() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    return onMessage((message) => {
      if (message.type === "toggleContent") {
        setVisible((v) => !v);
      }
    });
  }, []);

  if (!visible) return null;

  return (
    <ThemeRoot>
      <div className="fixed right-0 top-0 z-[1000000] h-screen w-[400px] rounded-l-xl bg-background shadow-2xl">
        <AppShell onClose={() => setVisible(false)} />
      </div>
    </ThemeRoot>
  );
}

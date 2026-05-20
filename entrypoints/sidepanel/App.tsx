import "../../assets/main.css";
import { AppShell } from "@/components/app/app-shell";
import { useTheme } from "@/components/theme-provider";

export default function App() {
  const { theme } = useTheme();
  return (
    <div className={theme}>
      <div className="fixed inset-0 bg-background">
        <AppShell />
      </div>
    </div>
  );
}

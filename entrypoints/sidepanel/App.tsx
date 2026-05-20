import "../../assets/main.css";
import { AppShell } from "@/components/app/app-shell";
import { ThemeRoot } from "@/components/app/theme-root";

export default function App() {
  return (
    <ThemeRoot>
      <div className="fixed inset-0 bg-background">
        <AppShell />
      </div>
    </ThemeRoot>
  );
}

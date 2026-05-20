import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAppStore, useStoreHydration } from "@/lib/store";
import type { ThemeMode, ThemePreset } from "@/lib/storage";

type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
}

// Only used to share the matchMedia listener state across the tree.
const SystemThemeContext = createContext<ResolvedTheme>("light");

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useStoreHydration();
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(mql.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <SystemThemeContext.Provider value={systemTheme}>
      {children}
    </SystemThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const systemTheme = useContext(SystemThemeContext);
  const theme = useAppStore((s) => s.theme);
  const preset = useAppStore((s) => s.themePreset);
  const setTheme = useAppStore((s) => s.setTheme);
  const setPreset = useAppStore((s) => s.setThemePreset);
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;
  return { theme, resolvedTheme, setTheme, preset, setPreset };
}

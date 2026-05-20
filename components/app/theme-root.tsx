import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface ThemeRootProps {
  children: ReactNode;
  className?: string;
}

/**
 * Applies the resolved theme class (`light` / `dark`) and the current
 * theme-preset data attribute. Wrap each entrypoint's tree in this so
 * shadcn CSS variables resolve correctly.
 */
export function ThemeRoot({ children, className }: ThemeRootProps) {
  const { resolvedTheme, preset } = useTheme();
  return (
    <div className={cn(resolvedTheme, className)} data-theme-preset={preset}>
      {children}
    </div>
  );
}

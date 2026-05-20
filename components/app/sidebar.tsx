import { useState } from "react";
import { Home, Settings as SettingsIcon, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SidebarType = "home" | "settings";

interface NavItem {
  type: SidebarType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { type: "home", label: "Home", icon: Home },
  { type: "settings", label: "Settings", icon: SettingsIcon },
];

interface SidebarProps {
  active: SidebarType;
  onNavigate: (type: SidebarType) => void;
  onClose?: () => void;
}

export function Sidebar({ active, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="absolute inset-y-0 right-0 z-10 flex w-14 flex-col border-l bg-background">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-2 flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          {NAV.map(({ type, label, icon: Icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onNavigate(type)}
                  aria-current={active === type ? "page" : undefined}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                    active === type
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}

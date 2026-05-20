import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPage } from "@/components/app/settings-page";

// The settings sections pull in heavy concerns (radio groups + store + i18n);
// stub them so this test focuses on the tab structure itself.
vi.mock("@/components/settings/i18n-settings", () => ({
  I18nSettings: () => <div data-testid="i18n">i18n</div>,
}));
vi.mock("@/components/settings/theme-settings", () => ({
  ThemeSettings: () => <div data-testid="theme">theme</div>,
}));
vi.mock("@/components/settings/preset-settings", () => ({
  PresetSettings: () => <div data-testid="preset">preset</div>,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string, fb?: string) => fb ?? k }),
}));

describe("<SettingsPage>", () => {
  it("starts on the General tab and hides Appearance until clicked", async () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("i18n")).toBeInTheDocument();
    expect(screen.queryByTestId("theme")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "appearance" }));
    expect(screen.getByTestId("theme")).toBeInTheDocument();
    expect(screen.getByTestId("preset")).toBeInTheDocument();
  });
});

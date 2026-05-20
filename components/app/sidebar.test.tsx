import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "@/components/app/sidebar";

describe("<Sidebar>", () => {
  it("renders Home and Settings nav buttons", () => {
    render(<Sidebar active="home" onNavigate={() => {}} />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Settings" })
    ).toBeInTheDocument();
  });

  it("calls onNavigate when an item is clicked", async () => {
    const onNavigate = vi.fn();
    render(<Sidebar active="home" onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalledWith("settings");
  });

  it("marks the active item with aria-current", () => {
    render(<Sidebar active="settings" onNavigate={() => {}} />);
    expect(screen.getByRole("button", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "Home" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("only renders the close button when onClose is provided", () => {
    const { rerender } = render(
      <Sidebar active="home" onNavigate={() => {}} />
    );
    expect(
      screen.queryByRole("button", { name: "Close panel" })
    ).not.toBeInTheDocument();
    rerender(
      <Sidebar active="home" onNavigate={() => {}} onClose={() => {}} />
    );
    expect(
      screen.getByRole("button", { name: "Close panel" })
    ).toBeInTheDocument();
  });
});

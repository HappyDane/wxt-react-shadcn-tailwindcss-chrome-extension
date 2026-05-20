import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
import { resetBrowserMock } from "./mocks/browser";

beforeEach(() => {
  resetBrowserMock();
  vi.clearAllMocks();
});

// Globally mock `wxt/browser` with our in-memory implementation so any
// `import { browser } from "wxt/browser"` resolves to the same store.
vi.mock("wxt/browser", async () => {
  const { browser } = await import("./mocks/browser");
  return { browser };
});

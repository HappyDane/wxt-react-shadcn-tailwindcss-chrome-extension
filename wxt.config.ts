import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs"],
    action: {},
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    commands: {
      "open-side-panel": {
        suggested_key: {
          default: "Alt+Shift+S",
          mac: "Alt+Shift+S",
        },
        description: "Open the extension side panel",
      },
      "toggle-content": {
        suggested_key: {
          default: "Alt+Shift+W",
          mac: "Alt+Shift+W",
        },
        description: "Toggle the in-page widget on the active tab",
      },
    },
  },
  vite: () => ({
    plugins: [react()],
  }),
});

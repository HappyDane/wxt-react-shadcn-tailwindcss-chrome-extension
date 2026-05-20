import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { i18nConfig } from "@/components/i18nConfig";
import initTranslations from "@/components/i18n";
import { ThemeProvider } from "@/components/theme-provider";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    await initTranslations(i18nConfig.defaultLocale, ["common", "content"]);
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-extension-content-ui",
      position: "inline",
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <ThemeProvider>
            <App />
          </ThemeProvider>
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});

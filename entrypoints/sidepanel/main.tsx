import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { ThemeProvider } from "@/components/theme-provider";
import { i18nConfig } from "@/components/i18nConfig";
import initTranslations from "@/components/i18n";

initTranslations(i18nConfig.defaultLocale, ["common", "sidepanel"]).then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
});


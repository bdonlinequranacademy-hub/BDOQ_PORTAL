import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/app/router";
import { queryClient } from "@/app/queryClient";
import { Toaster } from "@/components/ui/Toaster";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getStoredLocale, setLocalePreference } from "@/i18n/locale";
import { defaultLocale } from "@/i18n/types";
import { initPortalTheme } from "@/stores/themeStore";
import "./index.css";

initPortalTheme();
setLocalePreference(getStoredLocale() ?? defaultLocale);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LocaleProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

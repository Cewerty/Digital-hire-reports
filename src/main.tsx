import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { LoadingState } from "@/components/layout/LoadingState";
import { initTheme } from "@/lib/theme";
import { createRouter } from "@/router";
import "@/index.css";

initTheme();

const router = createRouter();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<LoadingState label="Загрузка приложения…" />}
    />
    <Toaster position="top-right" richColors />
  </React.StrictMode>,
);

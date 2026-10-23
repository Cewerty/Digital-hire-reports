import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { initTheme } from "@/lib/theme";
import { createRouter } from "@/router";
import "@/index.css";

initTheme();

const router = createRouter();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-right" richColors />
  </React.StrictMode>,
);

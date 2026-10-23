import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Тесты не требуют DOM: `applyReportUpdate`, `validateReport` и
  // `cloneReport` — чистые функции (docs/decisions.md §13).
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});

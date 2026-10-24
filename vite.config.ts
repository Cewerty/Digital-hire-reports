import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Конфиг production-сборки.
 *
 * Намеренно не импортирует `vitest/config`: `tsc -b` и `vite build` не должны
 * зависеть от devDependency `vitest`. Иначе сборка на Vercel/CI с
 * `npm ci --omit=dev` падала бы на резолве типов. Конфиг тестов — отдельный
 * файл `vitest.config.ts`.
 */
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/vite-profile/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

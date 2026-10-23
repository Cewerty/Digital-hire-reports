import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Конфиг Vitest.
 *
 * Отдельный от `vite.config.ts`, чтобы production-сборка не зависела от
 * `vitest`. Vitest читает `vitest.config.ts` в приоритете над `vite.config.ts`,
 * поэтому алиас `@` дублируется здесь.
 *
 * Тесты не требуют DOM: `applyReportUpdate`, `validateReport` и
 * `cloneReport` — чистые функции (docs/decisions.md §13).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});

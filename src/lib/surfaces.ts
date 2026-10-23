/**
 * Централизованные классы поверхностей из `docs/design-system.md` §2–§3.
 *
 * Слои и границы заданы **семантическими токенами** (`src/index.css` +
 * `tailwind.config.js`), а не hex-значениями. Тема переключается через
 * `.dark`, поэтому в компонентах нет ни `bg-[#F4F5F7]`, ни `dark:bg-[#252525]`.
 *
 * Зачем константы, если есть токены: комбинации «слой + граница + hover»
 * повторяются в `ProfilePage`, `ReportPage`, `ReviewPage`, `ReportDocument`,
 * `SectionSources`, `CandidatesListPage` и `LoadingState`. Один источник
 * исключает расхождения вроде `border-border` у карточки против
 * `border-transparent` у плашки.
 *
 * Правила (§11.1, §11.4):
 * - карточка верхнего уровня — `CARD_SURFACE_CLASS` / `CARD_INTERACTIVE_CLASS`;
 * - вложенная плашка — `PLATE_SURFACE_CLASS` / `PLATE_INTERACTIVE_CLASS`;
 * - тени — только `shadow-xs`, поэтому в константах их нет.
 *
 * Классы записаны полными строками, чтобы Tailwind JIT находил их при
 * сканировании исходников (см. `content` в `tailwind.config.js`).
 */

/** Карточка верхнего уровня: `bg-card` (`#F4F5F7` / `#252525`), без hover. */
export const CARD_SURFACE_CLASS = "border border-transparent bg-card";

/** Интерактивная карточка: hover-граница `--border-hover` (§3.3). */
export const CARD_INTERACTIVE_CLASS = `${CARD_SURFACE_CLASS} transition-colors hover:border-border-hover`;

/** Вложенная плашка: `bg-plate` + видимая граница `--plate-border` (§11.1). */
export const PLATE_SURFACE_CLASS = "border border-plate-border bg-plate";

/** Интерактивная плашка: слои `PLATE_SURFACE_CLASS` + hover-граница. */
export const PLATE_INTERACTIVE_CLASS = `${PLATE_SURFACE_CLASS} transition-colors hover:border-plate-border-hover`;

/** Hover-подсветка строки свойства в духе Notion (§2, «Интерактивный Hover»). */
export const PROPERTY_ROW_HOVER_CLASS = "transition-colors hover:bg-plate";

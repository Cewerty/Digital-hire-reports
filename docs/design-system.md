# Дизайн-система: Институциональная идентичность (СИЭУиП) + Эргономика Notion

## 1. Концепция

Визуальный язык объединяет фирменный стиль портала института (`sielom.ru`) с компактной документальной эргономикой Notion.  
Принцип двух тем:

- **Светлая тема:** чистый фон, мягкие серые карточки без резких рамок, тёплый янтарно-золотой акцент и глубокий институциональный графит.
- **Тёмная тема (Notion Dark Palette):** отсутствие глубокого чёрного (`#000000`). Слоёная архитектура тёплого графита (`#191919` — холст, `#202020` — сайдбар, `#252525` — карточки), мягкий неслепящий текст (`#E3E3E3`) и янтарное золото в качестве главного фокусного маркера.

---

## 2. Цветовая палитра, слои и токены

### Архитектура поверхностей (Layers & Elevation)

| Уровень интерфейса | Светлая тема | Тёмная тема (Notion Dark) | Tailwind-классы (Dark Mode) |
| :--- | :--- | :--- | :--- |
| **Холст страницы (`--background`)** | `#FFFFFF` | `#191919` | `bg-white dark:bg-[#191919]` |
| **Боковая панель (Sidebar)** | `#F4F5F7` | `#202020` | `bg-[#F4F5F7] dark:bg-[#202020]` |
| **Поверхность карточек (`--card`)** | `#F4F5F7` | `#252525` | `bg-[#F4F5F7] dark:bg-[#252525]` |
| **Внутренние теги / Плашки в карточках** | `#FFFFFF` | `#2F2F2F` | `bg-white dark:bg-[#2F2F2F]` |
| **Интерактивный Hover (кнопки, строки)** | `#E9EBEF` | `#2F2F2F` / `rgba(255,255,255,0.055)` | `hover:bg-slate-200/70 dark:hover:bg-[#2F2F2F]` |
| **Границы и разделители (`--border`)** | `#E5E7EB` (`border-slate-200/80`) | `#2E2E2E` (`rgba(255,255,255,0.09)`) | `border-slate-200/80 dark:border-[#2E2E2E]` |

### Акценты и текст

- **Фирменный акцент института (`--primary`):** Янтарно-золотой `#E5BA41` / `#F2CA52` (HSL: `44 76% 58%`).
  - **КРИТИЧЕСКИ ВАЖНО:** Текст поверх сплошного `--primary` ВСЕГДА тёмно-графитовый (`#1E2028`), **включая тёмную тему**. Белый текст на золотом не проходит по контрасту WCAG!
- **Строгий акцент (Институциональный Графит):**
  - *Светлая тема:* `#2E303E` (`bg-[#2E303E] text-white`).
  - *Тёмная тема:* повышенная контрастность `dark:bg-[#2F313D] dark:text-slate-200 dark:border dark:border-[#3E4252]`.
- **Основной текст:**
  - *Светлая тема:* `text-slate-900` (`#0F172A`).
  - *Тёмная тема:* мягкий белый `dark:text-[#E3E3E3]` (не `text-white` / `#FFFFFF`, чтобы не вызывать усталость глаз).
- **Второстепенный текст / подписи свойств:**
  - *Светлая тема:* `text-slate-500` (`#64748B`).
  - *Тёмная тема:* приглушённый пепельный `dark:text-[#9B9B9B]` (`dark:text-slate-400`).

---

### Семантика бейджей этапа отбора (`PipelineStage`)

Форма пилюли: `rounded-full px-3 py-0.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors`. В тёмной теме используются десатурированные фоны Notion (без кислотного неона):

- `approved` («Подтверждён»):
  - *Light:* `bg-emerald-100 text-emerald-900 border border-emerald-200`
  - *Dark:* `dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50`
  - Иконка: `CheckCircle2`
- `in_review` («На рассмотрении»):
  - *Light:* `bg-[#F5D061]/40 text-[#1E2028] border border-[#E5BA41]`
  - *Dark:* `dark:bg-amber-950/40 dark:text-[#F2CA52] dark:border-[#E5BA41]/50`
  - Иконка: `Clock`
- `uninterviewed` («Не опрошен»):
  - *Light:* `bg-white text-slate-600 border border-slate-200`
  - *Dark:* `dark:bg-[#2F2F2F] dark:text-slate-300 dark:border-[#3E3E3E]`
  - Иконка: `MinusCircle`
- `rejected` («Отклонён»):
  - *Light:* `bg-red-50 text-red-800 border border-red-200`
  - *Dark:* `dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50`
  - Иконка: `XCircle`

---

## 3. Геометрия и Сетка (Desktop-first: 1280px–1920px)

1. **Боковая панель (Sidebar):**
   - Меню подразделений `sielom.ru` + складывание в духе Notion.
   - Ширина: открыт — `w-60` (`240px`), свёрнут — `w-16` (`64px`).
   - Фон и разделитель: `bg-[#F4F5F7] dark:bg-[#202020] border-r border-slate-200/80 dark:border-[#2E2E2E]`.
   - Активный пункт: капсула `bg-[#F2CA52] text-[#1E2028] font-medium rounded-xl shadow-xs`.
   - Неактивные пункты: `text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#2A2A2A] hover:text-slate-900 dark:hover:text-[#E3E3E3] rounded-xl`.
2. **Контейнеры страниц:**
   - Внешние отступы рабочей области: `px-8 py-6`.
   - Для страниц списков и дашборда (`CuratorDashboardPage`, `CandidatesListPage`): `max-w-6xl mx-auto`.
   - Для текстовых страниц (`ProfilePage`, `ReportPage`, `ReviewPage`): `max-w-4xl mx-auto` (длина строки для чтения отчёта — 65–75 символов).
3. **Карточки и теги:**
   - Карточки: `rounded-2xl bg-[#F4F5F7] dark:bg-[#252525] p-5 border border-transparent hover:border-slate-300 dark:hover:border-[#383838] transition-colors`.
   - Внутренние теги внутри карточек: `rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-[#2F2F2F] text-slate-700 dark:text-slate-200 border border-transparent dark:border-[#3A3A3A]`.
   - Тени: никаких тяжелых теней (`shadow-lg`, `shadow-xl` запрещены). Только `shadow-xs` в светлой теме и тонкие границы `border-[#2E2E2E]` в тёмной.

---

## 4. Типографика

1. **Паттерн заголовков с количеством (`Заголовок · N`):**
   - Пример: `Кандидаты · 4`, `Источники раздела · 3`, `Последние события · 4`.
   - Стили H1: `text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#E3E3E3]`.
2. **Реквизиты документа (Notion Properties):**
   - Сетка `py-1.5` с горизонтальным выравниванием.
   - Подпись слева: `w-44 text-sm text-slate-500 dark:text-[#9B9B9B] flex items-center gap-2`.
   - Значение справа: `text-sm font-medium text-slate-900 dark:text-[#E3E3E3]`.
3. **Markdown (`MarkdownContent`):**
   - `@tailwindcss/typography`: `prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed`.

---

## 5. Интерактивные элементы и Состояния

- **Фильтры воронки (`/candidates`):**
  - Активный фильтр: `bg-[#F2CA52] text-[#1E2028] font-medium shadow-xs`.
  - Неактивные: `bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#2E2E2E] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2F2F2F]`.
- **Кольцо фокуса (Keyboard Focus):**  
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#191919]`.
- **Состояние Disabled:**  
  `disabled:opacity-40 disabled:pointer-events-none` с обязательной текстовой подсказкой.
- **Индикация сохранения и действий:**  
  Кнопки сохранения/утверждения — `bg-[#F2CA52] hover:bg-[#E5BA41] text-[#1E2028] font-medium transition-colors`. Второстепенные кнопки — `bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#2E2E2E] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2F2F2F]`.

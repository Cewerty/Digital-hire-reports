# Дизайн-система: Институциональная идентичность (СИЭУиП) + Эргономика Notion

## 1. Концепция

Визуальный язык объединяет фирменный стиль портала института (`sielom.ru`) с компактной документальной эргономикой Notion.
Никакого визуального шума, лишних градиентов и «игровых» элементов.

## 2. Цветовая палитра и поверхности (Токены)

Основной принцип `sielom.ru`: чистый светлый фон, мягкие светло-серые карточки без резких границ, тёплый янтарно-золотой акцент с тёмным текстом и глубокий графитовый цвет для вторичных строгих акцентов.

- **Фон страницы (`--background`):** Чистый светлый `#FFFFFF` (в тёмной теме — глубокий графит `#181920`).
- **Поверхность карточек и сайдбара (`--muted` / `--card`):** Мягкий светло-серый `#F4F5F7` (`bg-slate-100/80` или `bg-[#F4F5F7]`).
- **Фирменный акцент института (`--primary`):** Янтарно-золотой `#E5BA41` / `#F2CA52` (HSL: `44 76% 58%`).
  - **ВАЖНО:** Текст поверх `--primary` ВСЕГДА тёмно-графитовый (`#1E2028`, `--primary-foreground: 228 14% 14%`), никогда не белый!
- **Строгий акцент (Графит):** `#2E303E` (`bg-[#2E303E] text-white`) — для строгих бейджей и вторичных активных элементов.
- **Фирменный красный (Лого/Деструктивный):** `#D93829` — только для ошибок валидации и статуса «Отклонён».
- **Рамки (`--border`):** Деликатные, малоконтрастные `#E5E7EB` (`border-slate-200/80`).

### Семантика бейджей этапа отбора (`PipelineStage`)

Статусы различаются и цветом, и явной текстовой подписью (форма пилюли `rounded-full px-3 py-0.5 text-xs font-medium`):

- `approved` («Подтверждён»): `bg-emerald-100 text-emerald-900 border border-emerald-200` (иконка `CheckCircle2`).
- `in_review` («На рассмотрении»): фирменный янтарный `bg-[#F5D061]/40 text-[#1E2028] border border-[#E5BA41]` (иконка `Clock`).
- `uninterviewed` («Не опрошен»): `bg-white text-slate-600 border border-slate-200` (иконка `HelpCircle` или `MinusCircle`).
- `rejected` («Отклонён»): `bg-red-50 text-red-800 border border-red-200` (иконка `XCircle`).

## 3. Геометрия и Сетка (Desktop-first: 1280px–1920px)

1. **Боковая панель (Sidebar):**
   - В стиле меню со страницы сотрудников `sielom.ru` + механика складывания Notion.
   - Ширина в открытом состоянии: `w-60` (`240px`), в свёрнутом: `w-16` (`64px`).
   - Фон: `bg-[#F4F5F7] border-r border-slate-200/80`.
   - Активный пункт меню: капсула/плашка `bg-[#F2CA52] text-[#1E2028] font-medium rounded-xl` (как в списке подразделений института).
2. **Контейнеры страниц:**
   - Единые внешние отступы рабочей области: `px-8 py-6`.
   - Для страниц `CuratorDashboardPage` и `CandidatesListPage`: `max-w-6xl mx-auto`.
   - Для текстовых страниц (`ProfilePage`, `ReportPage`, `ReviewPage`): `max-w-4xl mx-auto` (обеспечивает комфортную длину строки 65–75 символов для чтения отчёта).
3. **Скругления и тени:**
   - Карточки реестра и блоки дашборда: `rounded-2xl bg-[#F4F5F7] p-5 border border-transparent hover:border-slate-300 transition-colors` (стиль карточек специальностей `sielom.ru`).
   - Внутренние теги/пилюли внутри серых карточек: чистые белые капсулы `bg-white rounded-full px-3 py-1 text-xs font-medium text-slate-700 shadow-none`.
   - Отказ от тяжёлых теней (`shadow-lg`, `shadow-xl` запрещены); максимум `shadow-xs` для белых элементов на сером фоне.

## 4. Типографика

1. **Паттерн заголовков с количеством (`Заголовок · N`):**
   - Главные заголовки разделов со счётчиками оформляются через среднюю точку, как на `sielom.ru`:
     `Кандидаты · 4`, `Источники раздела · 3`, `Последние события · 4`.
   - Классы H1 страницы: `text-2xl font-semibold tracking-tight text-slate-900`.
2. **Реквизиты документа (Notion Properties):**
   - Двухколоночная сетка с минимальными отступами (`py-1.5`).
   - Подписи слева: `w-44 text-sm text-slate-500 flex items-center gap-2`.
   - Значения справа: `text-sm font-medium text-slate-900`.
3. **Длинный Markdown (`MarkdownContent`):**
   - Обязательное применение классов `@tailwindcss/typography`: `prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed`.

## 5. Интерактивные состояния и Анимации

- **Фильтры на странице `/candidates`:** Капсульные кнопки (`rounded-full px-4 py-1.5 text-sm`). Активный фильтр — `bg-[#F2CA52] text-[#1E2028] font-medium`, неактивные — `bg-white border border-slate-200 text-slate-600 hover:bg-slate-50`.
- **Keyboard Focus:** Чёткое кольцо фокуса `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-1`.
- **Disabled:** `disabled:opacity-50 disabled:pointer-events-none` с явным текстовым пояснением причины (например, если отчёт ещё не создан).
- **Анимации:** Только короткие переходы `transition-colors duration-150` и `transition-[width] duration-200 ease-out` для сайдбара с поддержкой `motion-reduce:transition-none`. Никаких фейковых лоадеров и бессмысленных прогресс-баров загрузки.

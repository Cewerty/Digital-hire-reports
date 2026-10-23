import type {
  Candidate,
  CandidateReport,
  CuratorProfile,
  InterviewEntry,
  ReportSection,
} from "@/types/candidateReport";

/** Демонстрационные состояния интерфейса, задаваемые через `?state=`. */
export type DemoViewState = "default" | "loading" | "empty";

/**
 * Разбирает query-параметр `state`.
 * `loading` — имитация асинхронной загрузки, `empty` — отсутствие данных.
 */
export function parseDemoViewState(value: string | null): DemoViewState {
  if (value === "loading" || value === "empty") {
    return value;
  }

  return "default";
}

export const demoCurator: CuratorProfile = {
  id: "cur-001",
  fullName: "Анна Прототипова",
  direction: "Frontend-разработка",
  recentEvents: [
    {
      id: "evt-1",
      timestamp: "2025-01-16T09:30:00",
      text: "Утвердила отчёт по кандидату Елене Соколовой.",
      candidateId: "c-02",
    },
    {
      id: "evt-2",
      timestamp: "2025-01-15T18:05:00",
      text: "Назначила интервью с Иваном Прототиповым.",
      candidateId: "c-01",
    },
    {
      id: "evt-3",
      timestamp: "2025-01-15T12:40:00",
      text: "Отклонила заявку Григория Морозова.",
      candidateId: "c-04",
    },
    {
      id: "evt-4",
      timestamp: "2025-01-14T10:15:00",
      text: "Добавила в реестр Веру Кузнецову.",
      candidateId: "c-03",
    },
  ],
};

const candidateA: Candidate = {
  id: "c-01",
  fullName: "Иван Прототипов",
  preferredName: "Иван",
  course: 4,
  group: "ПРОГ-41",
  specialty: "Программная инженерия",
  pipelineStage: "in_review",
};

const candidateB: Candidate = {
  id: "c-02",
  fullName: "Елена Соколова",
  preferredName: "Елена",
  course: 3,
  group: "ПРОГ-31",
  specialty: "Программная инженерия",
  pipelineStage: "approved",
};

const candidateC: Candidate = {
  id: "c-03",
  fullName: "Вера Кузнецова",
  preferredName: "Вера",
  course: 2,
  group: "ПРОГ-21",
  specialty: "Программная инженерия",
  pipelineStage: "uninterviewed",
};

const candidateD: Candidate = {
  id: "c-04",
  fullName: "Григорий Морозов",
  preferredName: "Григорий",
  course: 4,
  group: "ПРОГ-42",
  specialty: "Программная инженерия",
  pipelineStage: "rejected",
};

export const demoCandidates: Candidate[] = [
  candidateA,
  candidateB,
  candidateC,
  candidateD,
];

const candidateAInterviews: InterviewEntry[] = [
  {
    id: "int-1",
    question: "Расскажите о вашем опыте разработки.",
    answer:
      "Я занимаюсь frontend-разработкой около трёх лет. Начинал с небольших учебных проектов, затем перешёл к коммерческой разработке. Последний год работаю над продуктом с активной пользовательской базой, где отвечаю за архитектуру компонентов и производительность интерфейса.",
  },
  {
    id: "int-2",
    question: "Какие технологии вы используете в работе?",
    answer:
      "Основной стек — React, TypeScript, Vite и Tailwind CSS. Также работаю с Node.js для вспомогательных скриптов, использую Git и Bash в повседневной работе. Пишу модульные тесты на Vitest.",
  },
  {
    id: "int-3",
    question: "Как вы учились программированию?",
    answer:
      "Начинал с самостоятельного изучения по онлайн-курсам и документации. Позже поступил на профильную специальность, где систематизировал знания. Много практиковался на личных проектах и стажировке.",
  },
  {
    id: "int-4",
    question: "Используете ли вы Bash и Git?",
    answer:
      "Да, ежедневно. Git — для контроля версий, работы с ветками и код-ревью. Bash — для автоматизации рутинных задач, запуска скриптов и настройки окружения.",
  },
  {
    id: "int-5",
    question: "Есть ли у вас доступные старые репозитории?",
    answer:
      "К сожалению, большинство моих старых учебных проектов не находятся в открытом доступе. Часть была удалена, часть осталась в приватных репозиториях. Могу показать код по запросу, если это необходимо.",
  },
  {
    id: "int-6",
    question: "Что вы знаете о блокчейне?",
    answer:
      "Понимаю базовые принципы: распределённый реестр, консенсус, смарт-контракты. Читал документацию Ethereum, знаком с концепцией децентрализованных приложений.",
  },
  {
    id: "int-7",
    question: "Есть ли у вас практика разработки на Solidity?",
    answer:
      "Практики написания смарт-контрактов на Solidity у меня нет. Я изучал теорию, но не реализовывал полноценные проекты.",
  },
  {
    id: "int-8",
    question: "Пользовались ли вы криптовалютными кошельками?",
    answer:
      "Да, я создавал кошельки MetaMask и Trust Wallet, выполнял тестовые транзакции в тестовых сетях. Понимаю, как взаимодействовать с dApp через кошелёк.",
  },
  {
    id: "int-9",
    question: "Сколько времени вы можете уделять проекту?",
    answer:
      "Сейчас у меня достаточно свободного времени: около 20–25 часов в неделю. График гибкий, могу подстраиваться под командные встречи и дедлайны.",
  },
  {
    id: "int-10",
    question: "Почему вы хотите участвовать в этом соревновании?",
    answer:
      "Мне интересна задача, связанная с автоматизацией отчётности. Хочу применить свои навыки в реальном продукте, поработать в команде и получить обратную связь от опытного наставника.",
  },
  {
    id: "int-11",
    question: "Какие у вас ожидания от наставника?",
    answer:
      "Ожидаю помощи в архитектурных решениях, код-ревью и советах по лучшим практикам. Хочу, чтобы наставник указывал на слабые места и помогал расти.",
  },
  {
    id: "int-12",
    question: "Есть ли у вас организационные вопросы?",
    answer:
      "Интересует, как будет организован процесс: частота встреч, формат постановки задач, какие инструменты для коммуникации используются. Также хотел бы понять критерии оценки результата.",
  },
];

const candidateBInterviews: InterviewEntry[] = [
  {
    id: "int-b1",
    question: "Расскажите о вашем опыте командной разработки.",
    answer:
      "Работала в команде из четырёх человек над учебным проектом: вела frontend-часть, участвовала в код-ревью и планировании спринтов.",
  },
  {
    id: "int-b2",
    question: "Какие технологии вы используете в работе?",
    answer:
      "React, TypeScript, Git и Vitest. Настраивала сборку на Vite и писала модульные тесты для ключевых компонентов.",
  },
];

const candidateDInterviews: InterviewEntry[] = [
  {
    id: "int-d1",
    question: "Почему вы хотите участвовать в этом проекте?",
    answer:
      "Хочу попробовать себя в командной разработке, хотя свободного времени на проект немного.",
  },
  {
    id: "int-d2",
    question: "Сколько времени вы можете уделять проекту?",
    answer:
      "Около пяти часов в неделю, поэтому участие может быть нерегулярным.",
  },
];

const candidateAReportSections: ReportSection[] = [
  {
    id: "summary",
    markdown: `Иван — студент 4 курса направления «Программная инженерия». Имеет около трёх лет практического опыта frontend-разработки, преимущественно с React и TypeScript. На интервью продемонстрировал уверенное понимание современных инструментов: Vite, Tailwind CSS, Git, Bash. Проявляет интерес к блокчейн-технологиям, но без практики Solidity.

Кандидат мотивирован на участие в соревновании, готов уделять проекту 20–25 часов в неделю. Ожидает от наставника помощи в архитектуре и код-ревью.`,
    sourceEntryIds: ["int-1", "int-2", "int-9", "int-10", "int-11"],
  },
  {
    id: "description",
    markdown: `Иван производит впечатление самостоятельного и ответственного разработчика. В беседе подробно описал свой опыт: от учебных проектов до коммерческой разработки. Уверенно отвечает на вопросы о технологиях, аргументирует выбор инструментов.

Особо отмечает, что старые репозитории недоступны публично, но готов предоставить код по запросу. Это не является блокером, но требует дополнительной проверки навыков на практике.

Кандидат демонстрирует системное мышление: понимает, как устроен процесс разработки, знаком с Git Flow, умеет работать в команде.`,
    sourceEntryIds: ["int-1", "int-3", "int-4", "int-5"],
  },
  {
    id: "skills",
    markdown: `**Технический стек:**
- React (функциональные компоненты, хуки, контекст)
- TypeScript (строгая типизация, generics)
- Vite (настройка сборки, плагины)
- Tailwind CSS (атомарный подход, кастомизация)
- Node.js (скрипты, простые API)
- Git (ветвление, merge, code review)
- Bash (автоматизация, работа с CLI)

**Опыт:**
- Разработка SPA с нуля
- Миграция легаси-проекта с AngularJS на React
- Написание модульных тестов (Vitest)
- Оптимизация производительности интерфейса

**Блокчейн:**
- Теоретические знания: консенсус, смарт-контракты, Ethereum
- Практика: создание кошельков, тестовые транзакции
- Solidity: без практического опыта`,
    sourceEntryIds: ["int-2", "int-4", "int-6", "int-7", "int-8"],
  },
  {
    id: "motivation",
    markdown: `Иван заинтересован в продуктовой разработке и возможности влиять на конечный результат. Его привлекает задача автоматизации отчётности, так как она сочетает frontend-разработку с реальной бизнес-ценностью.

Ожидания от наставника:
- помощь в архитектурных решениях
- регулярное код-ревью
- советы по лучшим практикам
- обратная связь по слабым местам

Кандидат готов уделять проекту 20–25 часов в неделю, гибко подстраиваясь под командные встречи. Это позволяет рассчитывать на его активное участие.`,
    sourceEntryIds: ["int-9", "int-10", "int-11"],
  },
  {
    id: "next_steps",
    markdown: `1. Провести техническое интервью с командой frontend-разработки для проверки практических навыков.
2. Запросить пример кода из приватных репозиториев или выполнить тестовое задание.
3. Обсудить организационные детали: расписание встреч, инструменты коммуникации, критерии оценки.
4. Определить наставника и согласовать формат взаимодействия.
5. Подготовить план адаптации и первые задачи.`,
    sourceEntryIds: ["int-5", "int-12"],
  },
  {
    id: "conclusions",
    markdown: `**Плюсы:**
- Уверенное владение React, TypeScript, Vite, Tailwind CSS
- Опыт коммерческой разработки
- Высокая мотивация и готовность уделять время
- Понимание процессов разработки и командной работы

**Риски:**
- Отсутствие публичных репозиториев для проверки кода
- Нет практики Solidity, что может замедлить работу с блокчейн-частью
- Самоотчёт о навыках требует подтверждения на практике

**Вердикт:**
Кандидат соответствует требованиям вакансии. Рекомендуем перейти к следующему этапу отбора с обязательной проверкой практических навыков.`,
    sourceEntryIds: ["int-1", "int-2", "int-5", "int-7", "int-9", "int-10"],
  },
];

const candidateAReport: CandidateReport = {
  candidateId: candidateA.id,
  candidateDisplayName: candidateA.fullName,
  metadata: {
    recipients: "Команда найма",
    interviewer: "Мария Прототипова",
    contact: "ivan.prototipov@example.com",
    contactDate: "2025-01-15",
    direction: "Frontend-разработка",
    curator: "Анна Прототипова",
    candidateStatus: "Рекомендован в основной состав подготовки",
  },
  sections: candidateAReportSections,
  documentState: "draft",
};

const candidateBReport: CandidateReport = {
  candidateId: candidateB.id,
  candidateDisplayName: candidateB.fullName,
  metadata: {
    recipients: "Команда найма",
    interviewer: "Мария Прототипова",
    contact: "elena.sokolova@example.com",
    contactDate: "2025-01-10",
    direction: "Frontend-разработка",
    curator: "Анна Прототипова",
    candidateStatus: "Рекомендована в основной состав подготовки",
  },
  sections: [
    {
      id: "summary",
      markdown:
        "Елена — студентка 3 курса. Уверенно работает с React и TypeScript, имеет опыт командной разработки.",
      sourceEntryIds: ["int-b1"],
    },
    {
      id: "description",
      markdown:
        "Самостоятельна, аккуратна в коде, быстро осваивает новые инструменты.",
      sourceEntryIds: ["int-b1"],
    },
    {
      id: "skills",
      markdown: "- React\n- TypeScript\n- Git\n- Vitest",
      sourceEntryIds: ["int-b2"],
    },
    {
      id: "motivation",
      markdown:
        "Хочет участвовать в реальном продукте и получить опыт код-ревью.",
      sourceEntryIds: ["int-b2"],
    },
    {
      id: "next_steps",
      markdown: "1. Согласовать наставника.\n2. Выдать первую задачу.",
      sourceEntryIds: ["int-b1", "int-b2"],
    },
    {
      id: "conclusions",
      markdown: "**Вердикт:** кандидат рекомендована. Риски минимальны.",
      sourceEntryIds: ["int-b1"],
    },
  ],
  documentState: "approved",
};

const demoReports: Record<string, CandidateReport> = {
  [candidateA.id]: candidateAReport,
  [candidateB.id]: candidateBReport,
};

const demoInterviews: Record<string, InterviewEntry[]> = {
  [candidateA.id]: candidateAInterviews,
  [candidateB.id]: candidateBInterviews,
  [candidateD.id]: candidateDInterviews,
};

/** Находит кандидата по идентификатору. */
export function getCandidateById(id: string): Candidate | undefined {
  return demoCandidates.find((item) => item.id === id);
}

/**
 * Глубокая копия отчёта: вызывающая сторона не должна получать ссылку
 * на исходные демонстрационные данные и мутировать их.
 */
function cloneReport(report: CandidateReport): CandidateReport {
  return {
    ...report,
    metadata: { ...report.metadata },
    sections: report.sections.map((section) => ({
      ...section,
      sourceEntryIds: [...section.sourceEntryIds],
    })),
  };
}

/**
 * Возвращает глубокую копию отчёта кандидата или `undefined`, если отчёт
 * ещё не создан.
 */
export function getReportByCandidateId(
  id: string,
): CandidateReport | undefined {
  const report = demoReports[id];
  return report ? cloneReport(report) : undefined;
}

/** Возвращает материалы интервью кандидата; пустой массив, если их нет. */
export function getInterviewByCandidateId(id: string): InterviewEntry[] {
  return demoInterviews[id] ?? [];
}

/** Кандидат детального вертикального среза (`c-01`). */
export const demoCandidate = candidateA;
/** Материалы интервью кандидата `c-01`. */
export const demoInterviewEntries = candidateAInterviews;
/** Отчёт кандидата `c-01`. */
export const demoReport = candidateAReport;

// Совместимость с прежними именами экспорта.
export const candidate = demoCandidate;
export const interviewEntries = demoInterviewEntries;
export const candidateReport = demoReport;

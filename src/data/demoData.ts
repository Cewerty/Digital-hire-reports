import type {
  Candidate,
  CandidateReport,
  InterviewEntry,
} from "@/types/candidateReport";
import { reportSections } from "@/data/reportSections";

export const candidate: Candidate = {
  id: "cand-001",
  fullName: "Иван Прототипов",
  preferredName: "Иван",
  course: 4,
  group: "ПРОГ-41",
  specialty: "Программная инженерия",
};

export const interviewEntries: InterviewEntry[] = [
  {
    id: "int-1",
    question: "Расскажите о вашем опыте разработки.",
    answer:
      "У меня 3 года опыта в frontend-разработке. Начинал с небольших SPA, последний год работаю над продуктом с активной пользовательской базой.",
  },
  {
    id: "int-2",
    question: "Какие технологии вы используете в работе?",
    answer:
      "Основной стек — TypeScript, React и Node.js. Также работаю с REST API и пишу модульные тесты.",
  },
  {
    id: "int-3",
    question: "Почему вас заинтересовала эта вакансия?",
    answer:
      "Мне интересна продуктовая разработка. Хочу видеть, как мои решения влияют на пользователей, и развиваться в сторону senior-позиции.",
  },
  {
    id: "int-4",
    question: "Как вы видите своё развитие в ближайшие два года?",
    answer:
      "Планирую углубляться в архитектуру frontend-приложений и постепенно брать на себя наставничество.",
  },
  {
    id: "int-5",
    question: "Какие у вас ожидания по формату работы?",
    answer:
      "Комфортен гибридный формат. Главное — прозрачные процессы и понятные цели команды.",
  },
  {
    id: "int-6",
    question: "Что вы знаете о нашей компании?",
    answer:
      "Знаю, что вы развиваете продукт для автоматизации отчётности. Привлекает сильная инженерная культура и ориентация на качество.",
  },
  {
    id: "int-7",
    question: "Какие у вас есть вопросы к нам?",
    answer:
      "Интересует, как устроен онбординг и какие задачи будут у нового разработчика в первые месяцы.",
  },
  {
    id: "int-8",
    question: "Опишите самый сложный проект, в котором вы участвовали.",
    answer:
      "Участвовал в миграции легаси-проекта с AngularJS на React. Отвечал за постепенный перевод модулей и сохранение обратной совместимости.",
  },
];

export const candidateReport: CandidateReport = {
  candidateId: candidate.id,
  candidateDisplayName: candidate.fullName,
  metadata: {
    recipients: "Команда найма",
    interviewer: "Мария Прототипова",
    contact: "ivan.prototipov@example.com",
    contactDate: "2025-01-15",
    direction: "Frontend-разработка",
    curator: "Анна Прототипова",
    candidateStatus: "Рекомендован к найму",
  },
  sections: reportSections,
  documentState: "draft",
};

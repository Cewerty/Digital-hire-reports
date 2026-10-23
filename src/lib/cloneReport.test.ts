import { describe, expect, it } from "vitest";

import { cloneReport } from "@/lib/cloneReport";
import type {
  CandidateReport,
  ReportSection,
  ReportSectionId,
} from "@/types/candidateReport";

function makeReport(): CandidateReport {
  return {
    candidateId: "c-01",
    candidateDisplayName: "Иван Прототипов",
    metadata: {
      recipients: "Команда найма",
      interviewer: "Мария Прототипова",
      contact: "ivan.prototipov@example.com",
      contactDate: "2025-01-15",
      direction: "Frontend-разработка",
      curator: "Анна Прототипова",
      candidateStatus: "Рекомендован",
    },
    sections: [
      { id: "summary", markdown: "Резюме", sourceEntryIds: ["int-1"] },
      { id: "skills", markdown: "Навыки", sourceEntryIds: ["int-2", "int-3"] },
    ],
    documentState: "draft",
  };
}

function requireSection(
  report: CandidateReport,
  id: ReportSectionId,
): ReportSection {
  const section = report.sections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Раздел ${id} не найден`);
  }
  return section;
}

describe("cloneReport", () => {
  it("возвращает структурно равную копию", () => {
    const original = makeReport();

    expect(cloneReport(original)).toEqual(original);
  });

  it("не делит ссылки с исходным отчётом", () => {
    const original = makeReport();
    const clone = cloneReport(original);

    expect(clone).not.toBe(original);
    expect(clone.metadata).not.toBe(original.metadata);
    expect(clone.sections).not.toBe(original.sections);
    expect(requireSection(clone, "summary")).not.toBe(
      requireSection(original, "summary"),
    );
    expect(requireSection(clone, "summary").sourceEntryIds).not.toBe(
      requireSection(original, "summary").sourceEntryIds,
    );
  });

  it("изменения копии не влияют на исходный отчёт", () => {
    const original = makeReport();
    const clone = cloneReport(original);

    clone.metadata.direction = "Изменено";
    requireSection(clone, "summary").markdown = "Изменено";
    requireSection(clone, "summary").sourceEntryIds.push("int-99");

    expect(original.metadata.direction).toBe("Frontend-разработка");
    expect(requireSection(original, "summary").markdown).toBe("Резюме");
    expect(requireSection(original, "summary").sourceEntryIds).toEqual([
      "int-1",
    ]);
  });
});

import { describe, expect, it } from "vitest";

import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import { validateReport } from "@/lib/validateReport";
import type { CandidateReport, ReportSection } from "@/types/candidateReport";

function makeSections(markdown = "Содержание раздела"): ReportSection[] {
  return REPORT_SECTION_DEFINITIONS.map((definition) => ({
    id: definition.id,
    markdown,
    sourceEntryIds: [],
  }));
}

function makeReport(overrides: Partial<CandidateReport> = {}): CandidateReport {
  return {
    candidateId: "c-01",
    candidateDisplayName: "Иван Прототипов",
    metadata: {
      recipients: "",
      interviewer: "",
      contact: "",
      contactDate: "",
      direction: "Frontend-разработка",
      curator: "",
      candidateStatus: "",
    },
    sections: makeSections(),
    documentState: "draft",
    ...overrides,
  };
}

function fields(report: CandidateReport): string[] {
  return validateReport(report).map((error) => error.field);
}

describe("validateReport", () => {
  it("не возвращает ошибок для корректного отчёта", () => {
    expect(validateReport(makeReport())).toEqual([]);
  });

  it("требует имя в документе", () => {
    expect(fields(makeReport({ candidateDisplayName: "   " }))).toContain(
      "candidateDisplayName",
    );
  });

  it("требует направление", () => {
    const report = makeReport();
    report.metadata.direction = "  ";

    expect(fields(report)).toContain("direction");
  });

  it("требует непустой Markdown каждого раздела", () => {
    const report = makeReport();
    report.sections = report.sections.map((section) =>
      section.id === "skills" ? { ...section, markdown: "   " } : section,
    );

    expect(fields(report)).toEqual(["skills"]);
  });

  it("сообщает об отсутствующем разделе", () => {
    const report = makeReport();
    report.sections = report.sections.filter(
      (section) => section.id !== "motivation",
    );

    expect(fields(report)).toEqual(["motivation"]);
  });

  it("считает пустую дату корректной", () => {
    expect(fields(makeReport())).not.toContain("contactDate");
  });

  it.each(["2025-01-15", "2024-02-29"])(
    "принимает корректную дату %s",
    (date) => {
      const report = makeReport();
      report.metadata.contactDate = date;

      expect(fields(report)).not.toContain("contactDate");
    },
  );

  it.each(["2025-02-31", "2023-02-29", "2025-13-01", "не дата"])(
    "отклоняет некорректную дату %s",
    (date) => {
      const report = makeReport();
      report.metadata.contactDate = date;

      expect(fields(report)).toContain("contactDate");
    },
  );
});

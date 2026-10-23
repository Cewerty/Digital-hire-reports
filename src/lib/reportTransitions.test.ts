import { describe, expect, it } from "vitest";

import {
  type ReportUpdateDeps,
  type ReportUpdateState,
  applyPipelineStageTransition,
  applyReportUpdate,
  buildCuratorEvent,
  getReportTransition,
} from "@/lib/reportTransitions";
import type {
  Candidate,
  CandidateReport,
  CuratorProfile,
  PipelineStage,
} from "@/types/candidateReport";

function makeDeps(): ReportUpdateDeps {
  let counter = 0;
  return {
    createEventId: () => `evt-test-${++counter}`,
    now: () => new Date("2025-01-20T10:00:00.000Z"),
  };
}

function makeCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: "c-01",
    fullName: "Иван Прототипов",
    preferredName: "Иван",
    course: 4,
    group: "ПРОГ-41",
    specialty: "Программная инженерия",
    pipelineStage: "in_review",
    ...overrides,
  };
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
    sections: [],
    documentState: "draft",
    ...overrides,
  };
}

function makeCurator(overrides: Partial<CuratorProfile> = {}): CuratorProfile {
  return {
    id: "cur-001",
    fullName: "Анна Прототипова",
    direction: "Frontend-разработка",
    recentEvents: [],
    ...overrides,
  };
}

function makeState(
  overrides: Partial<ReportUpdateState> = {},
): ReportUpdateState {
  return {
    reports: { "c-01": makeReport() },
    candidates: [makeCandidate()],
    curator: makeCurator(),
    ...overrides,
  };
}

function requireCandidate(state: ReportUpdateState, id: string): Candidate {
  const candidate = state.candidates.find((item) => item.id === id);
  if (!candidate) {
    throw new Error(`Кандидат ${id} не найден`);
  }
  return candidate;
}

function requireReport(state: ReportUpdateState, id: string): CandidateReport {
  const report = state.reports[id];
  if (!report) {
    throw new Error(`Отчёт ${id} не найден`);
  }
  return report;
}

describe("getReportTransition", () => {
  it("считает утверждение переходом draft → approved", () => {
    expect(
      getReportTransition(
        makeReport(),
        makeReport({ documentState: "approved" }),
      ),
    ).toBe("approved");
  });

  it("не считает повторное утверждение новым переходом", () => {
    expect(
      getReportTransition(
        makeReport({ documentState: "approved" }),
        makeReport({ documentState: "approved" }),
      ),
    ).toBe("none");
  });

  it("считает возврат в черновик переходом approved → draft", () => {
    expect(
      getReportTransition(
        makeReport({ documentState: "approved" }),
        makeReport({ documentState: "draft" }),
      ),
    ).toBe("reverted");
  });

  it("не считает сохранение черновика переходом", () => {
    expect(getReportTransition(makeReport(), makeReport())).toBe("none");
  });

  it("считает первое утверждение без предыдущего отчёта переходом", () => {
    expect(
      getReportTransition(undefined, makeReport({ documentState: "approved" })),
    ).toBe("approved");
  });

  it("не считает первый черновик без предыдущего отчёта переходом", () => {
    expect(getReportTransition(undefined, makeReport())).toBe("none");
  });
});

describe("applyPipelineStageTransition", () => {
  const cases: ReadonlyArray<{
    from: PipelineStage;
    transition: "approved" | "reverted" | "none";
    to: PipelineStage;
  }> = [
    { from: "uninterviewed", transition: "approved", to: "reviewed" },
    { from: "in_review", transition: "approved", to: "reviewed" },
    { from: "reviewed", transition: "approved", to: "reviewed" },
    { from: "approved", transition: "approved", to: "approved" },
    { from: "rejected", transition: "approved", to: "rejected" },
    { from: "reviewed", transition: "reverted", to: "in_review" },
    { from: "in_review", transition: "reverted", to: "in_review" },
    { from: "approved", transition: "reverted", to: "approved" },
    { from: "rejected", transition: "reverted", to: "rejected" },
    { from: "uninterviewed", transition: "reverted", to: "uninterviewed" },
    { from: "in_review", transition: "none", to: "in_review" },
  ];

  it.each(cases)("$from + $transition → $to", ({ from, transition, to }) => {
    const candidate = makeCandidate({ pipelineStage: from });
    expect(
      applyPipelineStageTransition(candidate, transition).pipelineStage,
    ).toBe(to);
  });

  it("не создаёт новый объект, если этап не меняется", () => {
    const candidate = makeCandidate({ pipelineStage: "approved" });
    expect(applyPipelineStageTransition(candidate, "approved")).toBe(candidate);
  });

  it("создаёт новый объект при смене этапа и не мутирует исходный", () => {
    const candidate = makeCandidate({ pipelineStage: "in_review" });
    const next = applyPipelineStageTransition(candidate, "approved");

    expect(next).not.toBe(candidate);
    expect(candidate.pipelineStage).toBe("in_review");
    expect(next.pipelineStage).toBe("reviewed");
  });
});

describe("buildCuratorEvent", () => {
  it("формирует событие утверждения", () => {
    expect(
      buildCuratorEvent(
        makeReport({ documentState: "approved" }),
        "approved",
        makeDeps(),
      ),
    ).toEqual({
      id: "evt-test-1",
      timestamp: "2025-01-20T10:00:00.000Z",
      text: "Утверждён отчёт кандидата: Иван Прототипов",
      candidateId: "c-01",
    });
  });

  it("формирует событие возврата в черновик", () => {
    expect(buildCuratorEvent(makeReport(), "reverted", makeDeps())?.text).toBe(
      "Документ возвращён в черновик: Иван Прототипов",
    );
  });

  it("не формирует событие без перехода", () => {
    expect(buildCuratorEvent(makeReport(), "none", makeDeps())).toBeNull();
  });
});

describe("applyReportUpdate", () => {
  it("утверждение переводит кандидата в reviewed и добавляет событие", () => {
    const next = applyReportUpdate(
      makeState(),
      makeReport({ documentState: "approved" }),
      makeDeps(),
    );

    expect(requireReport(next, "c-01").documentState).toBe("approved");
    expect(requireCandidate(next, "c-01").pipelineStage).toBe("reviewed");
    expect(next.curator.recentEvents).toHaveLength(1);
    expect(next.curator.recentEvents[0]?.text).toBe(
      "Утверждён отчёт кандидата: Иван Прототипов",
    );
  });

  it("повторное утверждение не дублирует событие и не меняет этап", () => {
    const approved = makeReport({ documentState: "approved" });
    const state = makeState({
      reports: { "c-01": approved },
      candidates: [makeCandidate({ pipelineStage: "reviewed" })],
    });

    const next = applyReportUpdate(state, approved, makeDeps());

    expect(next.curator.recentEvents).toHaveLength(0);
    expect(requireCandidate(next, "c-01").pipelineStage).toBe("reviewed");
  });

  it("возврат в черновик откатывает reviewed → in_review", () => {
    const state = makeState({
      reports: { "c-01": makeReport({ documentState: "approved" }) },
      candidates: [makeCandidate({ pipelineStage: "reviewed" })],
    });

    const next = applyReportUpdate(
      state,
      makeReport({ documentState: "draft" }),
      makeDeps(),
    );

    expect(requireCandidate(next, "c-01").pipelineStage).toBe("in_review");
    expect(next.curator.recentEvents[0]?.text).toBe(
      "Документ возвращён в черновик: Иван Прототипов",
    );
  });

  it("не откатывает финальные этапы approved и rejected", () => {
    for (const stage of ["approved", "rejected"] as const) {
      const state = makeState({
        reports: { "c-01": makeReport({ documentState: "approved" }) },
        candidates: [makeCandidate({ pipelineStage: stage })],
      });

      const next = applyReportUpdate(
        state,
        makeReport({ documentState: "draft" }),
        makeDeps(),
      );

      expect(requireCandidate(next, "c-01").pipelineStage).toBe(stage);
    }
  });

  it("сохранение черновика не меняет кандидатов и ленту", () => {
    const state = makeState();
    const next = applyReportUpdate(
      state,
      makeReport({ documentState: "draft" }),
      makeDeps(),
    );

    expect(next.candidates).toBe(state.candidates);
    expect(next.curator).toBe(state.curator);
    expect(next.reports).not.toBe(state.reports);
  });

  it("не мутирует исходное состояние", () => {
    const state = makeState();

    applyReportUpdate(
      state,
      makeReport({ documentState: "approved" }),
      makeDeps(),
    );

    expect(requireReport(state, "c-01").documentState).toBe("draft");
    expect(requireCandidate(state, "c-01").pipelineStage).toBe("in_review");
    expect(state.curator.recentEvents).toHaveLength(0);
  });

  it("два перехода в одном тике дают два события и корректный этап", () => {
    const state = makeState();

    const afterApprove = applyReportUpdate(
      state,
      makeReport({ documentState: "approved" }),
      makeDeps(),
    );
    const afterRevert = applyReportUpdate(
      afterApprove,
      makeReport({ documentState: "draft" }),
      makeDeps(),
    );

    expect(afterRevert.curator.recentEvents).toHaveLength(2);
    expect(afterRevert.curator.recentEvents[0]?.text).toBe(
      "Документ возвращён в черновик: Иван Прототипов",
    );
    expect(afterRevert.curator.recentEvents[1]?.text).toBe(
      "Утверждён отчёт кандидата: Иван Прототипов",
    );
    expect(requireCandidate(afterRevert, "c-01").pipelineStage).toBe(
      "in_review",
    );
  });

  it("обновляет отчёт одного кандидата, не затрагивая остальных", () => {
    const state = makeState({
      reports: {
        "c-01": makeReport(),
        "c-02": makeReport({
          candidateId: "c-02",
          candidateDisplayName: "Елена Соколова",
        }),
      },
      candidates: [
        makeCandidate(),
        makeCandidate({
          id: "c-02",
          fullName: "Елена Соколова",
          pipelineStage: "in_review",
        }),
      ],
    });

    const next = applyReportUpdate(
      state,
      makeReport({
        candidateId: "c-02",
        candidateDisplayName: "Елена Соколова",
        documentState: "approved",
      }),
      makeDeps(),
    );

    expect(requireCandidate(next, "c-01").pipelineStage).toBe("in_review");
    expect(requireCandidate(next, "c-02").pipelineStage).toBe("reviewed");
    expect(requireReport(next, "c-01").documentState).toBe("draft");
  });
});

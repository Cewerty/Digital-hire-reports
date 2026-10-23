export type DocumentState = "draft" | "approved";

export type PipelineStage =
  | "uninterviewed"
  | "in_review"
  | "approved"
  | "rejected";

export type ReportSectionId =
  | "summary"
  | "description"
  | "skills"
  | "motivation"
  | "next_steps"
  | "conclusions";

export interface Candidate {
  id: string;
  fullName: string;
  preferredName: string;
  course: number;
  group: string;
  specialty: string;
  pipelineStage: PipelineStage;
}

export interface CuratorEvent {
  id: string;
  timestamp: string;
  text: string;
  candidateId?: string;
}

export interface CuratorProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  direction: string;
  recentEvents: CuratorEvent[];
}

export interface InterviewEntry {
  id: string;
  question: string;
  answer: string;
}

export interface ReportMetadata {
  recipients: string;
  interviewer: string;
  contact: string;
  contactDate: string;
  direction: string;
  curator: string;
  candidateStatus: string;
}

export interface ReportSection {
  id: ReportSectionId;
  markdown: string;
  sourceEntryIds: string[];
}

export interface CandidateReport {
  candidateId: string;
  candidateDisplayName: string;
  metadata: ReportMetadata;
  sections: ReportSection[];
  documentState: DocumentState;
}

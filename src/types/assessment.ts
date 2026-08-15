export type AnswerKind = "choice" | "scale" | "integer" | "action";

export type AnswerValue = string | number;

export type IdentifierQuestion = {
  question_id: string;
  answer_kind: AnswerKind;
  values?: string[];
  constraints?: { minimum: number; maximum: number; step: number };
};

export type AssessmentIdentifiers = {
  assessment_version: string;
  identifier_status: string;
  id_policy: Record<string, string | boolean>;
  mbti_input: { field: string; allowed_values: string[] };
  questions: IdentifierQuestion[];
};

export const MBTI_AXES = [
  { key: "EI", label: "에너지 방향", poles: ["E", "I"], poleLabels: ["E(외향형)", "I(내향형)"] },
  { key: "SN", label: "인식", poles: ["S", "N"], poleLabels: ["S(감각형)", "N(직관형)"] },
  { key: "TF", label: "판단", poles: ["T", "F"], poleLabels: ["T(사고형)", "F(감정형)"] },
  { key: "JP", label: "계획성", poles: ["J", "P"], poleLabels: ["J(판단형)", "P(인식형)"] },
] as const;

export type MbtiAxisKey = (typeof MBTI_AXES)[number]["key"];

export type MbtiSelection = Partial<Record<MbtiAxisKey, string>>;

export type AnswerInput = {
  question_id: string;
  value: AnswerValue;
};

export type AssessmentSubmissionInput = {
  assessment_version: string;
  participant: { nickname: string };
  answers: AnswerInput[];
  mbti: string;
};

export type AssessmentSubmissionOutput = {
  result_code: string;
  [key: string]: unknown;
};

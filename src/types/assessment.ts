export type AnswerKind = "choice" | "scale" | "integer" | "action";

export type AnswerValue = string | number;

export type IdentifierQuestion = {
  question_id: string;
  step: number;
  order: number;
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

export type ContentOption = { value: string; label: string };

export type ContentQuestion = {
  question_id: string;
  step: number;
  order: number;
  prompt: string;
  answer_kind: AnswerKind;
  options?: ContentOption[];
  instruction?: string;
  visual_endpoints?: { left: string; right: string };
  constraints?: { minimum: number; maximum: number; step: number };
};

export type AssessmentContent = {
  assessment_version: string;
  locale: string;
  questions: ContentQuestion[];
  mbti_screen: { prompt: string; submission_field: string };
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

export interface OverviewOutput {
  rarity: string;
  adjective: string;
  noun: string;
  result_name: string;
  character_id: string;
  image_url: string;
  tags: string[];
}

export interface AxisScoresOutput {
  attachment: number;
  expression: number;
  routine: number;
  egen: number;
}

export type PackagingType =
  | "fragile_box"
  | "minimal_box"
  | "matryoshka_box"
  | "locked_box";

export interface PackagingOutput {
  type: PackagingType;
  name: string;
  image_url: string;
  tags: string[];
  reason: string;
}

export type OpeningToolType =
  | "glove"
  | "utility_knife"
  | "magic_wand"
  | "chainsaw";

export interface OpeningToolOutput {
  type: OpeningToolType;
  name: string;
  image_url: string;
  tags: string[];
  reason: string;
}

export interface UnboxingKitOutput {
  axis_scores: AxisScoresOutput;
  packaging: PackagingOutput;
  opening_tool: OpeningToolOutput;
}

export interface FeatureOutput {
  title: string;
  description: string;
  tag: string;
}

export interface CharacterStoryOutput {
  title: string;
  description: string;
}

export interface ChargingActivityOutput {
  type: string;
  label: string;
}

export interface ChargingOutput {
  description: string;
  activities: ChargingActivityOutput[];
}

export interface CompatibleFriendOutput {
  badge: string;
  noun: string;
  character_id: string;
  image_url: string;
  description: string;
}

export interface AssessmentSubmissionOutput {
  result_code: string;
  participant: { nickname: string };
  overview: OverviewOutput;
  unboxing_kit: UnboxingKitOutput;
  features: FeatureOutput[];
  character_story: CharacterStoryOutput;
  can_do: string[];
  warnings: string[];
  charging: ChargingOutput;
  compatible_friends: CompatibleFriendOutput[];
}

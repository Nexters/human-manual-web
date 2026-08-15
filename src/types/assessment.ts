export type MbtiType =
  | "INTJ"
  | "ISTJ"
  | "ENTJ"
  | "ESTJ"
  | "INFJ"
  | "ISFJ"
  | "ENFJ"
  | "ESFJ"
  | "INFP"
  | "ISFP"
  | "ENFP"
  | "ESFP"
  | "INTP"
  | "ISTP"
  | "ENTP"
  | "ESTP";

export interface ParticipantInput {
  /** 결과 화면에 표시할 이름 또는 닉네임 */
  nickname: string;
}

export interface AnswerInput {
  /** 문항 고정 ID */
  question_id: string;
  /** 선택한 영문 ID 또는 입력한 정수 */
  value: string | number;
}

export interface AssessmentSubmissionInput {
  /** 문항 및 채점 계약 버전 */
  assessment_version: string;
  participant: ParticipantInput;
  /** 23개 고정 문항의 답변 목록 */
  answers: AnswerInput[];
  mbti: MbtiType;
}

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
  tags: string[];
  reason: string;
}

export interface UnboxingKitOutput {
  axis_scores: AxisScoresOutput;
  title: string;
  description: string;
  packaging: PackagingOutput;
  opening_tool: OpeningToolOutput;
}

export interface FeatureOutput {
  title: string;
  description: string;
}

export interface ChargingActivityOutput {
  type: string;
  label: string;
}

export interface ChargingOutput {
  score: number;
  description: string;
  activities: ChargingActivityOutput[];
}

export interface AssessmentSubmissionOutput {
  /** 결과를 다시 조회할 때 사용하는 고유 코드 */
  result_code: string;
  overview: OverviewOutput;
  unboxing_kit: UnboxingKitOutput;
  features: FeatureOutput[];
  can_do: string[];
  warnings: string[];
  charging: ChargingOutput;
}

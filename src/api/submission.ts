import { ASSESSMENT_VERSION, IDENTIFIERS } from "@/constants/assessment";
import type {
  AnswerInput,
  AnswerValue,
  AssessmentSubmissionInput,
  MbtiSelection,
} from "@/types/assessment";
import { toMbtiString } from "@/stores/testStore";

export class SubmissionValidationError extends Error {
  readonly reasons: string[];

  constructor(reasons: string[]) {
    super(reasons.join("\n"));
    this.name = "SubmissionValidationError";
    this.reasons = reasons;
  }
}

export const buildSubmission = (params: {
  nickname: string;
  answers: Record<string, AnswerValue>;
  mbti: MbtiSelection;
}): AssessmentSubmissionInput => {
  const { nickname, answers, mbti } = params;
  const reasons: string[] = [];

  const payload: AnswerInput[] = [];
  for (const question of IDENTIFIERS.questions) {
    const value = answers[question.question_id];
    if (value === undefined) {
      reasons.push(`답변 누락: ${question.question_id}`);
      continue;
    }
    payload.push({ question_id: question.question_id, value });
  }

  const mbtiString = toMbtiString(mbti);
  if (!mbtiString) {
    reasons.push("MBTI 4축이 모두 선택되지 않았습니다.");
  } else if (!IDENTIFIERS.mbti_input.allowed_values.includes(mbtiString)) {
    reasons.push(`허용되지 않은 MBTI 값: ${mbtiString}`);
  }

  if (reasons.length > 0) {
    throw new SubmissionValidationError(reasons);
  }

  return {
    assessment_version: ASSESSMENT_VERSION,
    participant: { nickname: nickname.trim() },
    answers: payload,
    mbti: mbtiString!,
  };
};

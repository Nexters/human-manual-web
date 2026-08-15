import identifiers from "./assessment-identifiers.v1.json";
import { QUESTIONS } from "./questions";
import type { AssessmentIdentifiers } from "@/types/assessment";

export const IDENTIFIERS = identifiers as AssessmentIdentifiers;

export const ASSESSMENT_VERSION = IDENTIFIERS.assessment_version;

export const TOTAL_QUESTIONS = IDENTIFIERS.questions.length;

export const MBTI_ALLOWED_VALUES = IDENTIFIERS.mbti_input.allowed_values;

export const CONSTRAINTS = Object.fromEntries(
  IDENTIFIERS.questions.filter((q) => q.constraints).map((q) => [q.question_id, q.constraints!]),
);

export const SCALE_UI_STEP = 20;

export const verifyQuestionContract = (): string[] => {
  const errors: string[] = [];
  const spec = new Map(IDENTIFIERS.questions.map((q) => [q.question_id, q]));

  const answered = QUESTIONS.filter((q) => q.questionId !== null);
  if (answered.length !== TOTAL_QUESTIONS) {
    errors.push(`문항 수 불일치: 화면 ${answered.length}개 / 계약 ${TOTAL_QUESTIONS}개`);
  }

  for (const question of answered) {
    const contract = spec.get(question.questionId!);
    if (!contract) {
      errors.push(`계약에 없는 문항: ${question.questionId}`);
      continue;
    }

    if (question.kind === "choice" || question.kind === "carousel") {
      const codeValues = question.options.map((option) => option.value);
      const specValues = contract.values ?? [];
      if (codeValues.join("|") !== specValues.join("|")) {
        errors.push(
          `${question.questionId} value 불일치\n  코드: ${codeValues.join(", ")}\n  계약: ${specValues.join(", ")}`,
        );
      }
    }

    if (question.kind === "action") {
      const codeValues = [question.pressValue, question.skipValue];
      const specValues = contract.values ?? [];
      if (codeValues.join("|") !== specValues.join("|")) {
        errors.push(`${question.questionId} action value 불일치`);
      }
    }
  }

  return errors;
};

if (import.meta.env.DEV) {
  const errors = verifyQuestionContract();
  if (errors.length > 0) {
    console.error(`[assessment] 문항 계약 검증 실패 ${errors.length}건\n\n${errors.join("\n\n")}`);
  }
}

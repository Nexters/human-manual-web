import identifiers from "./assessment-identifiers.v1.json";
import { CONTENT, CONTENT_BY_ID, QUESTION_META, type QuestionMeta } from "./questions";
import type { AnswerKind, AssessmentIdentifiers } from "@/types/assessment";

type AnsweredMeta = Exclude<QuestionMeta, { kind: "mbti" }>;

export const IDENTIFIERS = identifiers as AssessmentIdentifiers;

export const ASSESSMENT_VERSION = IDENTIFIERS.assessment_version;

export const TOTAL_QUESTIONS = IDENTIFIERS.questions.length;

export const MBTI_ALLOWED_VALUES = IDENTIFIERS.mbti_input.allowed_values;

export const CONSTRAINTS = Object.fromEntries(
  IDENTIFIERS.questions.filter((q) => q.constraints).map((q) => [q.question_id, q.constraints!]),
);

export const SCALE_UI_STEP = 20;

const NICKNAME_IN_CONTENT = "송송";

const META_ANSWER_KIND: Record<string, AnswerKind> = {
  choice: "choice",
  carousel: "choice",
  scale: "scale",
  integer: "integer",
  action: "action",
};

const IGNORED_IN_COPY = /[\s"'“”‘’]/g;

const normalizeCopy = (text: string): string => {
  return text.replaceAll("{nickname}", NICKNAME_IN_CONTENT).replace(IGNORED_IN_COPY, "");
};

export const verifyQuestionContract = (): string[] => {
  const errors: string[] = [];
  const spec = new Map(IDENTIFIERS.questions.map((q) => [q.question_id, q]));

  if (CONTENT.assessment_version !== ASSESSMENT_VERSION) {
    errors.push(`버전 불일치: 계약 ${ASSESSMENT_VERSION} / 문구 ${CONTENT.assessment_version}`);
  }

  const answered = QUESTION_META.filter((q): q is AnsweredMeta => q.questionId !== null);
  if (answered.length !== TOTAL_QUESTIONS) {
    errors.push(`문항 수 불일치: 화면 ${answered.length}개 / 계약 ${TOTAL_QUESTIONS}개`);
  }
  if (CONTENT.questions.length !== TOTAL_QUESTIONS) {
    errors.push(`문항 수 불일치: 문구 ${CONTENT.questions.length}개 / 계약 ${TOTAL_QUESTIONS}개`);
  }

  for (const meta of answered) {
    const questionId = meta.questionId!;
    const contract = spec.get(questionId);
    const content = CONTENT_BY_ID.get(questionId);

    if (!contract) {
      errors.push(`계약에 없는 문항: ${questionId}`);
      continue;
    }
    if (!content) {
      errors.push(`문구에 없는 문항: ${questionId}`);
      continue;
    }

    const metaKind = META_ANSWER_KIND[meta.kind];
    if (metaKind !== contract.answer_kind || content.answer_kind !== contract.answer_kind) {
      errors.push(
        `${questionId} answer_kind 불일치\n  화면: ${metaKind}\n  문구: ${content.answer_kind}\n  계약: ${contract.answer_kind}`,
      );
    }

    const contentValues = (content.options ?? []).map((option) => option.value);
    const specValues = contract.values ?? [];
    if (contentValues.join("|") !== specValues.join("|")) {
      errors.push(
        `${questionId} value 불일치\n  문구: ${contentValues.join(", ")}\n  계약: ${specValues.join(", ")}`,
      );
    }

    if (contract.constraints && !CONSTRAINTS[questionId]) {
      errors.push(`${questionId} constraints 누락`);
    }
    if ((meta.kind === "scale" || meta.kind === "integer") && !contract.constraints) {
      errors.push(`${questionId} 계약에 constraints 가 없습니다`);
    }

    if (meta.kind === "action") {
      const codeValues = [meta.pressValue, meta.skipValue];
      if (codeValues.join("|") !== specValues.join("|")) {
        errors.push(`${questionId} action value 불일치`);
      }
    }

    if (meta.kind === "carousel") {
      for (const value of contentValues) {
        if (!meta.characters[value]) {
          errors.push(`${questionId} 캐릭터 카피 누락: ${value}`);
        }
      }
    }

    if (meta.titleWrap && normalizeCopy(meta.titleWrap) !== normalizeCopy(content.prompt)) {
      errors.push(
        `${questionId} titleWrap 이 문구와 다릅니다\n  화면: ${meta.titleWrap.replaceAll("\n", " / ")}\n  문구: ${content.prompt}`,
      );
    }
    if (!meta.titleWrap && content.prompt.includes(NICKNAME_IN_CONTENT)) {
      errors.push(`${questionId} 제목에 닉네임이 있는데 titleWrap 이 없습니다`);
    }

    for (const [value, wrapped] of Object.entries(meta.optionWrap ?? {})) {
      const option = (content.options ?? []).find((item) => item.value === value);
      if (!option) {
        errors.push(`${questionId} optionWrap 대상 없음: ${value}`);
        continue;
      }
      if (normalizeCopy(wrapped) !== normalizeCopy(option.label)) {
        errors.push(
          `${questionId}.${value} optionWrap 이 문구와 다릅니다\n  화면: ${wrapped.replaceAll("\n", " / ")}\n  문구: ${option.label}`,
        );
      }
    }

    for (const option of content.options ?? []) {
      if (option.label.includes(NICKNAME_IN_CONTENT) && !meta.optionWrap?.[option.value]) {
        errors.push(
          `${questionId}.${option.value} 선택지에 닉네임이 있는데 optionWrap 이 없습니다`,
        );
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

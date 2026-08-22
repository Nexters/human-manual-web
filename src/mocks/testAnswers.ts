import { IDENTIFIERS } from "@/constants/assessment";
import { MBTI_AXES } from "@/types/assessment";
import type { AnswerValue, MbtiSelection } from "@/types/assessment";

/**
 * 전 문항에 첫 번째 유효값을 채운 답변 세트.
 * canEnterOrder는 "모든 이전 문항에 답했는지"만 보므로, 이렇게 전부 채워두면
 * QuestionPage 스토리에서 어떤 order로 바로 이동해도 리다이렉트되지 않는다.
 */
export function buildMockAnswers(): { answers: Record<string, AnswerValue>; mbti: MbtiSelection } {
  const answers: Record<string, AnswerValue> = {};
  for (const question of IDENTIFIERS.questions) {
    if (question.values?.length) answers[question.question_id] = question.values[0];
    else if (question.constraints) answers[question.question_id] = question.constraints.minimum;
  }

  const mbti: MbtiSelection = {};
  for (const axis of MBTI_AXES) {
    mbti[axis.key] = axis.poles[0];
  }

  return { answers, mbti };
}

export const MOCK_NICKNAME = "지은";

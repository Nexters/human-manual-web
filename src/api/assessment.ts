import axios from "axios";
import { apiClient } from "./client";
import type {
  AssessmentSubmissionInput,
  AssessmentSubmissionOutput,
  CompletedTestCountOutput,
} from "@/types/assessment";

export async function submitAssessment(input: AssessmentSubmissionInput) {
  const { data } = await apiClient.post<AssessmentSubmissionOutput>(
    "/api/tests/submissions",
    input,
  );
  return data;
}

export async function getAssessmentResult(resultCode: string) {
  const { data } = await apiClient.get<AssessmentSubmissionOutput>(`/api/results/${resultCode}`);
  return data;
}

/**
 * 결과 코드가 실제로 존재하는지 확인한다.
 * 궁합 API 는 코드가 틀려도 COMPATIBILITY_NOT_FOUND 하나만 주고 어느 쪽이 틀렸는지
 * 알려주지 않아, 인풋별로 에러를 붙이려면 코드마다 결과 조회로 확인해야 한다.
 */
export async function verifyResultCode(resultCode: string): Promise<boolean> {
  try {
    await getAssessmentResult(resultCode);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return false;

    // 네트워크·서버 오류는 코드 문제와 구분할 수 없다. 잘못된 코드라고 단정하지 않고
    // 통과시켜서, 이어지는 궁합 페이지의 에러 화면이 처리하게 둔다.
    return true;
  }
}

/** 결과 저장까지 성공한 누적 테스트 수. 홈 화면의 참여자 수 표기에 쓴다. */
export async function getCompletedTestCount() {
  const { data } = await apiClient.get<CompletedTestCountOutput>("/api/tests/submissions/count");
  return data.completed_count;
}

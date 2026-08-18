import { apiClient } from "./client";
import type { AssessmentSubmissionInput, AssessmentSubmissionOutput } from "@/types/assessment";

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

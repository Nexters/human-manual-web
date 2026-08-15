import { useMutation, useQuery } from "@tanstack/react-query";
import { getAssessmentResult, submitAssessment } from "@/api/assessment";
import type { AssessmentSubmissionInput } from "@/types/assessment";

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: (input: AssessmentSubmissionInput) => submitAssessment(input),
  });
}

export function useAssessmentResult(resultCode: string) {
  return useQuery({
    queryKey: ["assessmentResult", resultCode],
    queryFn: () => getAssessmentResult(resultCode),
    enabled: Boolean(resultCode),
  });
}

import { useQuery } from "@tanstack/react-query";
import { getAssessmentResult } from "@/api/assessment";

export function useAssessmentResult(resultCode: string) {
  return useQuery({
    queryKey: ["assessmentResult", resultCode],
    queryFn: () => getAssessmentResult(resultCode),
    enabled: Boolean(resultCode),
  });
}

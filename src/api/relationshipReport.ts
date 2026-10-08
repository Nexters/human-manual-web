import { apiClient } from "./client";
import type { RomanticReportCreateInput, RomanticReportOutput } from "@/types/compatibility";

// 결제 연동 전 베타 기간에는 관리자가 입력한 베타 코드를 헤더로 보내야 생성된다.
export async function createRomanticReport(input: RomanticReportCreateInput, betaCode: string) {
  const { data } = await apiClient.post<RomanticReportOutput>(
    "/api/relationship-reports/romantic",
    input,
    { headers: { "X-Pakit-Beta-Code": betaCode }, timeout: 120_000 },
  );
  return data;
}

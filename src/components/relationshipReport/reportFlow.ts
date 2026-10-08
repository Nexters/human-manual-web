// ------- 결제 → 성별 선택 → 생성(로딩) → 설명서 흐름 ------
// 베타 코드는 유출되면 안 되는 값이라 URL·스토리지에 남기지 않고 라우터 state 로만 넘긴다.
// 새로고침하면 사라지므로 그때는 결제 페이지부터 다시 시작한다.

export type GenderStepState = { betaCode: string };

export type ReportStepState = GenderStepState & { mineGender: string; partnerGender: string };

const pairQuery = (mine: string, friend: string) =>
  `mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`;

export const reportPaths = {
  checkout: (mine: string, friend: string) => `/compatibility/checkout?${pairQuery(mine, friend)}`,
  gender: (mine: string, friend: string) =>
    `/compatibility/report/gender?${pairQuery(mine, friend)}`,
  report: (mine: string, friend: string) => `/compatibility/report?${pairQuery(mine, friend)}`,
};

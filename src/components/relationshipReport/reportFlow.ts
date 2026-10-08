// ------- 성별 선택 → 주문 확인 → 카카오페이 결제 → 설명서 흐름 ------

const pairQuery = (mine: string, friend: string) =>
  `mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`;

export const reportPaths = {
  checkout: (mine: string, friend: string) => `/compatibility/checkout?${pairQuery(mine, friend)}`,
  gender: (mine: string, friend: string) =>
    `/compatibility/report/gender?${pairQuery(mine, friend)}`,
};

// Meta 픽셀(fbq) 래퍼.
//
// GA 와 역할이 다르다. GA 는 행동 분석용이라 세분화할수록 좋지만, 픽셀은 광고가
// 겨냥할 목표를 정하는 용도라 적을수록 좋다. Meta 는 하나의 이벤트를 골라 "이걸
// 일으킬 사람"을 찾아주므로, 이벤트가 많으면 어디에 최적화할지 흐려지기만 한다.
// 그래서 아래 네 개만 보낸다. 분석용 세부 이벤트는 GA 가 이미 담당한다.
//
//   PageView             모든 화면. 리타게팅 모수의 유일한 근거
//   Lead                 테스트 시작. 완주 수가 적은 초기의 최적화 목표
//   CompleteRegistration 테스트 완주. 본 최적화 목표
//   Purchase             결제 승인. 광고비 대비 매출(ROAS) 측정
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const isProduction = import.meta.env.MODE === "production";

type MetaEvent = "PageView" | "Lead" | "CompleteRegistration" | "Purchase";

export const trackMetaPageView = () => {
  if (!isProduction) return;
  window.fbq?.("track", "PageView");
};

export const trackMetaEvent = (event: MetaEvent, params?: Record<string, unknown>) => {
  if (!isProduction) return;
  window.fbq?.("track", event, params);
};

import { useState } from "react";

/**
 * 마운트 시점의 window.innerHeight를 한 번만 읽어 고정 px로 반환한다.
 * svh/lvh/dvh 같은 CSS 뷰포트 단위는 카카오톡 인앱 브라우저처럼 스크롤 중
 * 상단바가 나타났다 사라지는 환경에서 실시간 재계산되어 레이아웃이 흔들릴 수
 * 있는데, 이 값은 최초 측정 이후 고정되므로 그런 흔들림에 영향받지 않는다.
 */
export function useInitialViewportHeight(): number {
  const [height] = useState(() => window.innerHeight);
  return height;
}

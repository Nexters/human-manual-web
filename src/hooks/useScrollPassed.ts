import { useEffect, useRef, useState } from "react";

interface UseScrollPassedOptions {
  /** 뷰포트 상단에서 이 픽셀만큼 아래 지점을 기준선으로 삼는다. */
  offset?: number;
}

/**
 * ref가 달린 지점이 기준선(뷰포트 top + offset)을 위로 지나갔는지를 boolean으로 반환한다.
 * 스크롤 위치에 따라 즉시 재계산되며 위/아래 스크롤 모두에 반응한다.
 */
export function useScrollPassed<T extends HTMLElement>({ offset = 0 }: UseScrollPassedOptions = {}) {
  const ref = useRef<T>(null);
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setHasPassed(el.getBoundingClientRect().top <= offset);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [offset]);

  return { ref, hasPassed };
}

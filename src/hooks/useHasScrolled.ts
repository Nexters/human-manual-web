import { useEffect, useState } from "react";

/**
 * 페이지가 threshold 픽셀 이상 스크롤됐는지(window.scrollY > threshold)를 boolean으로 반환한다.
 */
export function useHasScrolled(threshold = 0) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > threshold);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return hasScrolled;
}

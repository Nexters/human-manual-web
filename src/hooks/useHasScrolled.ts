import { useEffect, useState } from "react";

/**
 * 페이지가 조금이라도 스크롤됐는지(window.scrollY > 0)를 boolean으로 반환한다.
 */
export function useHasScrolled() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 0);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return hasScrolled;
}

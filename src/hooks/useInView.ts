import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** true(기본값)면 최초 진입 후 관찰을 멈춘다. false면 스크롤에 따라 계속 토글된다. */
  once?: boolean;
}

export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const { threshold, rootMargin, once = true } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}

import { useEffect, useRef, useState } from "react";

export function useIsVisible<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

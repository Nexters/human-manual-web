import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 1000;
const DEFAULT_THRESHOLD = 0.4;

type UseCountUpOnVisibleOptions = {
  durationMs?: number;
  threshold?: number;
};

export function useCountUpOnVisible<T extends HTMLElement>(
  target: number,
  {
    durationMs = DEFAULT_DURATION_MS,
    threshold = DEFAULT_THRESHOLD,
  }: UseCountUpOnVisibleOptions = {},
) {
  const [value, setValue] = useState(0);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame: number;

    const tick = (start: number) => (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick(start));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frame = requestAnimationFrame(tick(performance.now()));
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, threshold]);

  return { value, ref };
}

import { useEffect, useState } from "react";

export function useImagesReady(sources: string[]) {
  const [readyState, setReadyState] = useState<{ sources: string[]; ready: boolean }>({
    sources,
    ready: sources.length === 0,
  });

  useEffect(() => {
    if (sources.length === 0) return;

    let cancelled = false;

    Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setReadyState({ sources, ready: true });
    });

    return () => {
      cancelled = true;
    };
  }, [sources]);

  return sources.length === 0 || (readyState.sources === sources && readyState.ready);
}

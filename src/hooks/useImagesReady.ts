import { useEffect, useState } from "react";

export function useImagesReady(sources: string[]) {
  const [ready, setReady] = useState(sources.length === 0);

  useEffect(() => {
    if (sources.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

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
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [sources]);

  return ready;
}

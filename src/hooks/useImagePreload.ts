import { useEffect } from "react";

export function useImagePreload(sources: string[]) {
  useEffect(() => {
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sources]);
}

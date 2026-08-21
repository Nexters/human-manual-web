import { useEffect, useState } from "react";

/**
 * CSS Font Loading API로 지정한 폰트를 명시적으로 내려받고, 전부 끝나면 true를 반환한다.
 * 이미 로드되어 있던 폰트는 즉시 resolve되므로(예: 첫 화면에서 미리 받아둔 경우) 대기 없이 넘어간다.
 * API를 지원하지 않는 환경(구형 브라우저)에서는 즉시 true로 취급해 렌더링을 막지 않는다.
 */
export function useFontsReady(fontSpecs: string[]) {
  const [ready, setReady] = useState(() => !("fonts" in document) || fontSpecs.length === 0);

  useEffect(() => {
    if (!("fonts" in document) || fontSpecs.length === 0) return;

    let cancelled = false;

    Promise.all(fontSpecs.map((spec) => document.fonts.load(spec).catch(() => undefined))).then(
      () => {
        if (!cancelled) setReady(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [fontSpecs]);

  return ready;
}

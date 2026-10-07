import { authMockEnabled, MOCK_SESSION_KEY } from "./authMockMode";

const RETURN_KEY = "auth_return_to";

export function startKakaoLogin() {
  try {
    sessionStorage.setItem(
      RETURN_KEY,
      window.location.pathname + window.location.search + window.location.hash,
    );
  } catch {
    /* 저장소가 차단되어도 로그인은 가능하다. */
  }
  if (authMockEnabled) {
    sessionStorage.setItem(MOCK_SESSION_KEY, "1");
    window.location.assign("/auth/complete");
    return;
  }
  const base = import.meta.env.VITE_API_BASE_URL || "https://api.pakit.kr";
  window.location.assign(`${base.replace(/\/$/, "")}/api/auth/kakao/login`);
}

export function consumeReturnTo() {
  let saved: string | null = null;
  try {
    saved = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* 기본 홈으로 복귀한다. */
  }
  if (!saved?.startsWith("/") || saved.startsWith("//")) return "/";
  try {
    const url = new URL(saved, window.location.origin);
    if (url.origin !== window.location.origin || url.pathname === "/auth/complete") return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

/** 현재 결과 저장소와 모든 버전의 테스트 저장소를 함께 읽는다. */
export function collectLocalResultCodes(): string[] {
  const codes = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || (key !== "pakit-result-code" && !key.startsWith("pakit-test-"))) continue;
      try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        const code = value?.state?.resultCode;
        if (typeof code === "string" && code.trim()) codes.add(code.trim());
      } catch {
        /* 손상된 항목은 다른 결과 연결에 영향을 주지 않는다. */
      }
    }
  } catch {
    /* 저장소가 차단된 환경은 동기화를 건너뛴다. */
  }
  return [...codes];
}

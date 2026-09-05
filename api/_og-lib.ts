// src/lib/resultCode.ts 와 동일한 규칙(OpenAPI AssessmentSubmissionOutput.result_code 제약:
// URL-safe 8자). 공유 문구가 뒤에 붙어 넘어오는 경우가 있어 앞 8자만 본다.
const RESULT_CODE_LENGTH = 8;
const RESULT_CODE_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${RESULT_CODE_LENGTH}}$`);

export function takeResultCode(value: string | null | undefined): string | null {
  const code = value?.slice(0, RESULT_CODE_LENGTH);
  return code && RESULT_CODE_PATTERN.test(code) ? code : null;
}

const API_BASE = "https://api.pakit.kr";

export async function fetchJson<T>(pathname: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${pathname}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fallbackResponse(origin: string): Response {
  return Response.redirect(new URL("/og-image-compatibility.jpg", origin), 302);
}

// Pretendard Bold subset. 시안 원래 폰트(WAGURI)는 1.4MB로 콜드스타트가 무거워
// 1차는 이걸로 진행하고, 실제 이미지 확인 후 필요하면 교체한다.
// Edge 런타임(@vercel/og 표준 실행 환경)은 fs를 못 쓰므로, 배경·캐릭터 이미지와
// 동일하게 public/ 자산을 fetch로 가져온다.
let fontDataPromise: Promise<ArrayBuffer> | null = null;

export function loadPretendardBold(origin: string): Promise<ArrayBuffer> {
  if (!fontDataPromise) {
    fontDataPromise = fetch(new URL("/og/fonts/pretendard-bold.woff", origin)).then((res) =>
      res.arrayBuffer(),
    );
  }
  return fontDataPromise;
}

// --- API 응답 타입 (필요 필드만. src/types 는 @/ alias 라 api/ 에서 import 불가) ---

export interface ResultOverview {
  rarity: string;
  adjective: string;
  noun: string;
  image_url: string;
  tags: string[];
}

export interface ResultData {
  participant: { nickname: string };
  overview: ResultOverview;
}

export interface CompatibilityPerson {
  nickname: string;
  noun: string;
  image_url: string;
}

export interface CompatibilityData {
  mine: CompatibilityPerson;
  friend: CompatibilityPerson;
  headline: string;
  description: string;
}

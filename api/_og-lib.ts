import { readFile } from "node:fs/promises";
import path from "node:path";

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
let fontDataPromise: Promise<ArrayBuffer> | null = null;

export function loadPretendardBold(): Promise<ArrayBuffer> {
  if (!fontDataPromise) {
    const fontPath = path.join(process.cwd(), "api/_fonts/pretendard-bold.woff");
    fontDataPromise = readFile(fontPath).then(
      (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
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

import { ImageResponse } from "@vercel/og";

export const config = { runtime: "nodejs" };

// 같은 코드는 결과가 바뀌지 않으므로 길게 캐시한다.
const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

// src/lib/resultCode.ts 와 동일한 규칙(OpenAPI AssessmentSubmissionOutput.result_code 제약:
// URL-safe 8자). 공유 문구가 뒤에 붙어 넘어오는 경우가 있어 앞 8자만 본다.
// api/ 는 Vercel이 함수별로 개별 컴파일하며, 파일 간 상대 import가 있으면 그 컴파일이
// 깨지는 사례가 있어 각 함수 파일에 필요한 코드를 전부 인라인한다.
const RESULT_CODE_LENGTH = 8;
const RESULT_CODE_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${RESULT_CODE_LENGTH}}$`);

function takeResultCode(value: string | null | undefined): string | null {
  const code = value?.slice(0, RESULT_CODE_LENGTH);
  return code && RESULT_CODE_PATTERN.test(code) ? code : null;
}

interface ResultData {
  participant: { nickname: string };
  overview: {
    rarity: string;
    adjective: string;
    noun: string;
    image_url: string;
    tags: string[];
  };
}

async function fetchResult(code: string): Promise<ResultData | null> {
  try {
    const res = await fetch(`https://api.pakit.kr/api/results/${code}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as ResultData;
  } catch {
    return null;
  }
}

function fallbackResponse(origin: string): Response {
  return Response.redirect(new URL("/og-image-compatibility.jpg", origin), 302);
}

// Pretendard Bold subset. 시안 원래 폰트(WAGURI)는 1.4MB로 콜드스타트가 무거워
// 1차는 이걸로 진행하고, 실제 이미지 확인 후 필요하면 교체한다.
function loadPretendardBold(origin: string): Promise<ArrayBuffer> {
  return fetch(new URL("/og/fonts/pretendard-bold.woff", origin)).then((res) => res.arrayBuffer());
}

function tagStyle(position: { top: number; left?: number; right?: number }) {
  return {
    display: "flex" as const,
    position: "absolute" as const,
    ...position,
    background: "#FFFFFF",
    borderRadius: 999,
    padding: "12px 22px",
    fontSize: 22,
    color: "#374151",
    whiteSpace: "nowrap" as const,
  };
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const code = takeResultCode(url.searchParams.get("code"));
  if (!code) return fallbackResponse(origin);

  const data = await fetchResult(code);
  if (!data) return fallbackResponse(origin);

  const { overview, participant } = data;
  const fontData = await loadPretendardBold(origin);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        fontFamily: "Pretendard",
      }}
    >
      <img
        src={`${origin}/og/result-bg.jpg`}
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* 좌측 텍스트 블록 */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          maxWidth: 560,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#C7F464",
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 26,
            color: "#1F2937",
          }}
        >
          {overview.rarity}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#F3F4F6" }}>{overview.adjective}</div>
        <div style={{ display: "flex", fontSize: 48, color: "#FFFFFF", lineHeight: 1.25 }}>
          {overview.noun} {participant.nickname}
        </div>
      </div>

      {/* 우측 캐릭터 */}
      <img
        src={overview.image_url}
        width={420}
        height={420}
        style={{ position: "absolute", right: 40, top: 110, objectFit: "contain" }}
      />

      {/* 태그 3개: 위(캐릭터 위) / 좌하 / 우하 */}
      {overview.tags[0] && <div style={tagStyle({ top: 40, right: 40 })}>{overview.tags[0]}</div>}
      {overview.tags[1] && <div style={tagStyle({ top: 350, left: 60 })}>{overview.tags[1]}</div>}
      {overview.tags[2] && <div style={tagStyle({ top: 400, right: 60 })}>{overview.tags[2]}</div>}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700, style: "normal" }],
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}

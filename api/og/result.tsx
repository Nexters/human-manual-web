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
    tags?: string[];
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

async function fetchFont(origin: string, path: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

const TEXT_SHADOW = "0px 4px 15px rgba(0,0,0,0.15)";

// Figma 시안(node 2952:9716)은 800x400 프레임. OG 는 1200x630 이라 시안 전체를
// x1.5 스케일해 옮긴다(폰트 크기 포함). 세로는 600 이 되어 상단 정렬.
// 태그 3개의 위치는 시안 절대 좌표 x1.5.
const TAG_POSITIONS: { top: number; left: number; width: number }[] = [
  { top: 69, left: 867, width: 171 }, // 도파민 MAX (우상단)
  { top: 369, left: 490, width: 154 }, // 장난꾸러기 (좌하단)
  { top: 468, left: 781, width: 219 }, // 혼자서도 잘놀아요 (우하단)
];

function tagStyle(pos: (typeof TAG_POSITIONS)[number]) {
  return {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    position: "absolute" as const,
    top: pos.top,
    left: pos.left,
    width: pos.width,
    height: 63,
    background: "rgba(255,255,255,0.8)",
    borderRadius: 999,
    fontSize: 24,
    color: "#4E5968",
    whiteSpace: "nowrap" as const,
  };
}

// Vercel Node 함수에서 Web Response 를 반환하려면 default export 가 아니라
// named HTTP 메서드(GET)로 내보내야 한다. 이 시그니처의 request 는 웹 표준 Request.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const code = takeResultCode(url.searchParams.get("code"));
  if (!code) return fallbackResponse(origin);

  const data = await fetchResult(code);
  if (!data) return fallbackResponse(origin);

  const { overview, participant } = data;
  // 제목은 시안대로 WAGURI, 나머지 텍스트는 Pretendard.
  const [pretendard, waguri] = await Promise.all([
    fetchFont(origin, "/og/fonts/pretendard-bold.woff"),
    fetchFont(origin, "/og/fonts/waguri.ttf"),
  ]);
  // satori 는 한글을 그리려면 폰트가 반드시 있어야 한다. 로드 실패 시 정적 이미지로.
  if (!pretendard) return fallbackResponse(origin);
  const tags = overview.tags ?? [];

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

      {/* 캐릭터 — 시안: 컨테이너 중심 (765, 261), inner 483px */}
      <div
        style={{
          position: "absolute",
          top: 261 - 340,
          left: 765 - 340,
          width: 681,
          height: 681,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={overview.image_url} width={483} height={483} style={{ objectFit: "contain" }} />
      </div>

      {/* 좌측 텍스트 블록 — 시안 x1.5 */}
      <div
        style={{
          position: "absolute",
          top: 68,
          left: 86,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#B4F861",
            borderRadius: 23,
            padding: "8px 22px",
            fontSize: 27,
            fontWeight: 700,
            color: "#333D4B",
          }}
        >
          {overview.rarity}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: "#FFFFFF",
            textShadow: TEXT_SHADOW,
          }}
        >
          {overview.adjective}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 4,
            fontSize: 60,
            lineHeight: 1,
            color: "#FFFFFF",
            fontFamily: waguri ? "WAGURI" : "Pretendard",
            textShadow: TEXT_SHADOW,
          }}
        >
          {overview.noun} {participant.nickname}
        </div>
      </div>

      {/* 태그 3개 — 시안 좌표 x1.5 */}
      {tags.slice(0, 3).map((tag, i) => (
        <div key={tag} style={tagStyle(TAG_POSITIONS[i])}>
          {tag}
        </div>
      ))}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Pretendard", data: pretendard, weight: 700, style: "normal" },
        ...(waguri
          ? [{ name: "WAGURI", data: waguri, weight: 400 as const, style: "normal" as const }]
          : []),
      ],
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}

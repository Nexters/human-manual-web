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

// Figma 시안(node 2952:9716, Frame 2147228628)은 800x400. OG 는 1200x630 이라
// 시안 좌표를 x1.5 스케일해 옮긴다(폰트·여백 포함). 세로 400x1.5=600 이므로
// 아래 15px 는 배경 여백.
const SCALE = 1.5;

// 캐릭터 — 시안(2952:9741)의 컨테이너는 size 454(프레임 400의 113%)지만, 그 안의
// 팽이 PNG 는 세로로 길쭉해 실제로는 박스의 ~70%만 채운다(≈ 프레임의 80%).
// 우리 캐릭터 PNG(1020x1020)는 여백이 적어 거의 꽉 차므로, 같은 시각 크기를 내려면
// 박스를 그만큼 줄여야 한다: OG 세로 630 의 약 82% = 520.
// 중심 x 는 시안 비율 유지(프레임 중앙 + 21%): 600 + 260 = 860 이면 우측이 잘려
// 프레임 안에 맞도록 640 으로. top 은 살짝 위로 넘치게.
const CHAR = { size: 520, left: 640, top: -10 };

// 태그 3개 — 시안(800기준) 캐릭터 박스 left283/top-53/size454 대비 pill 위치를
// 비율로 환산해, 축소된 우리 캐릭터 박스(CHAR)에 다시 얹는다. 이러면 캐릭터
// 크기를 바꿔도 태그가 캐릭터에 붙어 따라온다.
//   도파민 MAX  (578,46)  -> (0.65, 0.22)
//   장난꾸러기  (327,246) -> (0.10, 0.66)
//   혼자서도    (521,312) -> (0.52, 0.80)
const TAG_ANCHORS: { top: number; left: number }[] = [
  { left: CHAR.left + CHAR.size * 0.65, top: CHAR.top + CHAR.size * 0.22 },
  { left: CHAR.left + CHAR.size * 0.1, top: CHAR.top + CHAR.size * 0.66 },
  { left: CHAR.left + CHAR.size * 0.52, top: CHAR.top + CHAR.size * 0.8 },
];

// 시안(2952:9748 등): rgba(255,255,255,0.8), radius 24.33, Pretendard SemiBold
// 15.925, 자간 -0.637. 폰트는 Bold woff 하나만 로드하므로 weight 700 로 렌더.
const TAG_STYLE = {
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  position: "absolute" as const,
  padding: `${8 * SCALE}px ${15 * SCALE}px`,
  background: "rgba(255,255,255,0.8)",
  borderRadius: 24.33 * SCALE,
  fontSize: 15.925 * SCALE,
  fontWeight: 700,
  letterSpacing: -0.637 * SCALE,
  color: "#4E5968",
  whiteSpace: "nowrap" as const,
};

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

      {/* 캐릭터 — 앱 결과지처럼 정면, 회전 없음. 시안대로 중앙~우측에 크게.
          캐릭터 PNG 는 1020x1020 정사각(캐릭터마다 여백 다름). */}
      <img
        src={overview.image_url}
        width={CHAR.size}
        height={CHAR.size}
        style={{
          position: "absolute",
          top: CHAR.top,
          left: CHAR.left,
          objectFit: "contain",
        }}
      />

      {/* 좌측 텍스트 블록 — 시안: left 57*1.5, top 45*1.5 부터 세로로 쌓임 */}
      <div
        style={{
          position: "absolute",
          top: 45 * SCALE,
          left: 57 * SCALE,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#B4F861",
            borderRadius: 15 * SCALE,
            padding: `${6 * SCALE}px ${14 * SCALE}px`,
            fontSize: 18 * SCALE,
            fontWeight: 700,
            letterSpacing: -0.72 * SCALE,
            color: "#333D4B",
          }}
        >
          {overview.rarity}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18 * SCALE,
            fontSize: 20 * SCALE,
            fontWeight: 700,
            letterSpacing: -0.8 * SCALE,
            color: "#FFFFFF",
            textShadow: TEXT_SHADOW,
          }}
        >
          {overview.adjective}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 6 * SCALE,
            fontSize: 40 * SCALE,
            lineHeight: 1,
            letterSpacing: -1.6 * SCALE,
            color: "#FFFFFF",
            fontFamily: waguri ? "WAGURI" : "Pretendard",
            textShadow: TEXT_SHADOW,
          }}
        >
          {overview.noun} {participant.nickname}
        </div>
      </div>

      {/* 태그 3개 — 앱 결과지처럼 캐릭터 주변에 배치 */}
      {tags.slice(0, 3).map((tag, i) => (
        <div key={tag} style={{ ...TAG_STYLE, top: TAG_ANCHORS[i].top, left: TAG_ANCHORS[i].left }}>
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

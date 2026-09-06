import { ImageResponse } from "@vercel/og";

export const config = { runtime: "nodejs" };

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

// src/lib/resultCode.ts 와 동일한 규칙. api/ 는 Vercel이 함수별로 개별 컴파일하며
// 파일 간 상대 import가 있으면 그 컴파일이 깨지는 사례가 있어 필요한 코드를 인라인한다.
const RESULT_CODE_LENGTH = 8;
const RESULT_CODE_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${RESULT_CODE_LENGTH}}$`);

function takeResultCode(value: string | null | undefined): string | null {
  const code = value?.slice(0, RESULT_CODE_LENGTH);
  return code && RESULT_CODE_PATTERN.test(code) ? code : null;
}

interface ResultData {
  participant: { nickname: string };
  overview: { noun: string; image_url: string };
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

// ---- 시안(2972:18646, 800x450) 좌표를 OG(1200x630)로 옮긴다 ----
// 가로 x1.5, 세로 x1.4 (450 -> 630). 시안 비율을 그대로 보존하는 균일 스케일.
const H = 1.5; // 가로
const V = (y: number) => y * 1.4; // 세로

const TITLE_SHADOW = "0px 2px 4px rgba(0,0,0,0.1)";
const NAME_SHADOW = "0px 2.156px 8.623px rgba(0,0,0,0.1)";

// 두 캐릭터 컬럼 중심 x (프레임 중앙 ±117 * 1.5)
const COL_DX = 117 * H;
const CIRCLE = 175.662 * H; // 원형 반투명 배경
// 시안: 캐릭터 이미지 박스(174.25) 안에서 실제 캐릭터는 123.519. 즉 원의 ~70%.
// object-contain 이라 박스를 그 크기로 잡아야 캐릭터가 원 안에 들어온다.
const CHAR_BOX = 123.519 * H;

function CharacterColumn({
  centerX,
  imageSrc,
  noun,
  name,
  placeholder,
}: {
  centerX: number;
  imageSrc: string;
  noun: string;
  name: string;
  placeholder?: boolean;
}) {
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0 }}>
      {/* 원형 반투명 배경 */}
      <div
        style={{
          position: "absolute",
          left: centerX - CIRCLE / 2,
          top: V(130.77),
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: CIRCLE,
          background: "rgba(255,255,255,0.3)",
          display: "flex",
        }}
      />
      {/* 캐릭터 (회전 없음 — 앱 결과지와 동일하게 정면). 원 중앙에 놓는다. */}
      <img
        src={imageSrc}
        width={CHAR_BOX}
        height={CHAR_BOX}
        style={{
          position: "absolute",
          left: centerX - CHAR_BOX / 2,
          top: V(130.77) + CIRCLE / 2 - CHAR_BOX / 2,
          objectFit: "contain",
          opacity: placeholder ? 0.9 : 1,
        }}
      />
      {/* noun pill */}
      <div
        style={{
          position: "absolute",
          left: centerX - (91.711 * H) / 2,
          top: V(290.52),
          width: 91.711 * H,
          height: 32.099 * H,
          borderRadius: 22.928 * H,
          background: "#FFE7F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20 * H,
          fontWeight: 700,
          letterSpacing: -0.8 * H,
          color: "#6B7684",
          whiteSpace: "nowrap",
        }}
      >
        {noun}
      </div>
      {/* 이름 */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: V(332.19),
          transform: "translateX(-50%)",
          display: "flex",
          fontSize: 26 * H,
          fontWeight: 700,
          letterSpacing: -1.04 * H,
          color: "#FFFFFF",
          textShadow: NAME_SHADOW,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    </div>
  );
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
  // 이 시안(2972:18646)은 제목·이름·noun 전부 Pretendard Bold. WAGURI 불필요.
  const pretendard = await fetchFont(origin, "/og/fonts/pretendard-bold.woff");
  if (!pretendard) return fallbackResponse(origin);

  const centerX = 600;

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
        src={`${origin}/og/kemi-bg.jpg`}
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* 상단 중앙: 제목 + 부제 */}
      <div
        style={{
          position: "absolute",
          top: V(34),
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28 * H,
            fontWeight: 700,
            letterSpacing: -1.12 * H,
            color: "#FFFFFF",
            textShadow: TITLE_SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          {participant.nickname}님과의 케미를 보고 싶다면?
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 4 * H,
            fontSize: 18 * H,
            letterSpacing: -0.72 * H,
            color: "#F9FAFB",
            textShadow: TITLE_SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          {participant.nickname}님과 나는 어떤 사이일까요?
        </div>
      </div>

      {/* 왼쪽: 내 캐릭터 */}
      <CharacterColumn
        centerX={centerX - COL_DX}
        imageSrc={overview.image_url}
        noun={overview.noun}
        name={participant.nickname}
      />

      {/* × */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: V(205.62),
          transform: "translateX(-50%)",
          display: "flex",
          fontSize: 30 * H,
          fontWeight: 700,
          color: "#FFFFFF",
          textShadow: NAME_SHADOW,
        }}
      >
        ×
      </div>

      {/* 오른쪽: 곰돌이 (아직 상대를 모름) */}
      <CharacterColumn
        centerX={centerX + COL_DX}
        imageSrc={`${origin}/og/bear.png`}
        noun="???"
        name="나"
        placeholder
      />
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Pretendard", data: pretendard, weight: 700, style: "normal" }],
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}

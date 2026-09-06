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

interface CompatibilityPerson {
  nickname: string;
  noun: string;
  image_url: string;
}

interface CompatibilityData {
  mine: CompatibilityPerson;
  friend: CompatibilityPerson;
  headline: string;
  description: string;
}

async function fetchCompatibility(mine: string, friend: string): Promise<CompatibilityData | null> {
  try {
    const res = await fetch(
      `https://api.pakit.kr/api/compatibility?mine=${mine}&friend=${friend}`,
      {
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as CompatibilityData;
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

// ---- 시안(2952:9640, 800x450) 좌표를 OG(1200x630)로 옮긴다 ----
// 가로: x1.5. 세로: 시안 450, OG 630 이라 요소를 세로 중앙 정렬한다.
// (시안 y - 225) * 1.5 + 315 로 환산. invite.tsx 와 동일한 레이아웃.
const V = (y: number) => (y - 225) * 1.5 + 315;
const H = 1.5;

const TITLE_SHADOW = "0px 2px 4px rgba(0,0,0,0.1)";
const NAME_SHADOW = "0px 2.156px 8.623px rgba(0,0,0,0.1)";

const COL_DX = 117 * H;
const CIRCLE = 175.662 * H;
const CHAR_BOX = 174.25 * H;

function CharacterColumn({
  centerX,
  imageSrc,
  noun,
  name,
}: {
  centerX: number;
  imageSrc: string;
  noun: string;
  name: string;
}) {
  return (
    <div style={{ display: "flex", position: "absolute", left: 0, top: 0 }}>
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
      <img
        src={imageSrc}
        width={CHAR_BOX}
        height={CHAR_BOX}
        style={{
          position: "absolute",
          left: centerX - CHAR_BOX / 2,
          top: V(122),
          objectFit: "contain",
        }}
      />
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

  const mine = takeResultCode(url.searchParams.get("mine"));
  const friend = takeResultCode(url.searchParams.get("friend"));
  if (!mine || !friend) return fallbackResponse(origin);

  const data = await fetchCompatibility(mine, friend);
  if (!data) return fallbackResponse(origin);

  // 이 시안(2952:9640)은 제목·이름·noun 전부 Pretendard Bold. WAGURI 불필요.
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

      {/* 상단 중앙: headline + description */}
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
          {data.headline}
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
          {data.description}
        </div>
      </div>

      {/* 왼쪽: 내 캐릭터 */}
      <CharacterColumn
        centerX={centerX - COL_DX}
        imageSrc={data.mine.image_url}
        noun={data.mine.noun}
        name={data.mine.nickname}
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

      {/* 오른쪽: 친구 캐릭터 */}
      <CharacterColumn
        centerX={centerX + COL_DX}
        imageSrc={data.friend.image_url}
        noun={data.friend.noun}
        name={data.friend.nickname}
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

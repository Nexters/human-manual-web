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

// runtime: "nodejs" 함수의 req 는 Node IncomingMessage 다(웹 Request 아님).
interface NodeReq {
  url?: string;
  headers: Record<string, string | string[] | undefined>;
}

function firstHeader(h: NodeReq["headers"], key: string): string | undefined {
  const v = h[key];
  return Array.isArray(v) ? v[0] : v;
}

function resolveUrl(req: NodeReq): URL {
  const host = firstHeader(req.headers, "host") ?? "pakit.kr";
  const proto = firstHeader(req.headers, "x-forwarded-proto") ?? "https";
  return new URL(req.url ?? "/", `${proto}://${host}`);
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

async function loadPretendardBold(origin: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(new URL("/og/fonts/pretendard-bold.woff", origin), {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function PersonColumn({ imageSrc, noun, name }: { imageSrc: string; noun: string; name: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <img
        src={imageSrc}
        width={180}
        height={180}
        style={{ objectFit: "contain", borderRadius: "50%", background: "#FFFFFF" }}
      />
      <div
        style={{
          display: "flex",
          background: "#FCE7F3",
          borderRadius: 999,
          padding: "8px 20px",
          fontSize: 20,
          color: "#831843",
        }}
      >
        {noun}
      </div>
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#1F2937" }}>{name}</div>
    </div>
  );
}

export default async function handler(req: NodeReq) {
  const url = resolveUrl(req);
  const origin = url.origin;

  const code = takeResultCode(url.searchParams.get("code"));
  if (!code) return fallbackResponse(origin);

  const data = await fetchResult(code);
  if (!data) return fallbackResponse(origin);

  const { overview, participant } = data;
  const fontData = await loadPretendardBold(origin);
  if (!fontData) return fallbackResponse(origin);

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

      {/* 상단 중앙 제목 */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#1F2937" }}>
          {participant.nickname}님과의 케미를 보고 싶다면?
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#4B5563" }}>
          {participant.nickname}님과 나는 어떤 사이일까요?
        </div>
      </div>

      {/* 중앙: 내 캐릭터 x 곰돌이 */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <PersonColumn
          imageSrc={overview.image_url}
          noun={overview.noun}
          name={participant.nickname}
        />
        <div style={{ display: "flex", fontSize: 40, color: "#9CA3AF" }}>×</div>
        <PersonColumn imageSrc={`${origin}/og/bear.png`} noun="???" name="나" />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700, style: "normal" }],
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}

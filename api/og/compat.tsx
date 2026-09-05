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
      { signal: AbortSignal.timeout(4000) },
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

function loadPretendardBold(origin: string): Promise<ArrayBuffer> {
  return fetch(new URL("/og/fonts/pretendard-bold.woff", origin)).then((res) => res.arrayBuffer());
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

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const mine = takeResultCode(url.searchParams.get("mine"));
  const friend = takeResultCode(url.searchParams.get("friend"));
  if (!mine || !friend) return fallbackResponse(origin);

  const data = await fetchCompatibility(mine, friend);
  if (!data) return fallbackResponse(origin);

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
        src={`${origin}/og/kemi-bg.jpg`}
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* 상단 중앙: headline / description */}
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
          {data.headline}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#4B5563" }}>{data.description}</div>
      </div>

      {/* 중앙: 두 캐릭터 */}
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
          imageSrc={data.mine.image_url}
          noun={data.mine.noun}
          name={data.mine.nickname}
        />
        <div style={{ display: "flex", fontSize: 40, color: "#9CA3AF" }}>×</div>
        <PersonColumn
          imageSrc={data.friend.image_url}
          noun={data.friend.noun}
          name={data.friend.nickname}
        />
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

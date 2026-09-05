import { ImageResponse } from "@vercel/og";
import { fallbackResponse, fetchJson, loadPretendardBold, takeResultCode } from "../_og-lib.js";
import type { ResultData } from "../_og-lib.js";

export const config = { runtime: "nodejs" };

// 같은 코드는 결과가 바뀌지 않으므로 길게 캐시한다.
const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const code = takeResultCode(url.searchParams.get("code"));
  if (!code) return fallbackResponse(origin);

  const data = await fetchJson<ResultData>(`/api/results/${code}`);
  if (!data) return fallbackResponse(origin);

  const { overview, participant } = data;
  const fontData = await loadPretendardBold();

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

function tagStyle(position: { top: number; left?: number; right?: number }) {
  return {
    display: "flex",
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

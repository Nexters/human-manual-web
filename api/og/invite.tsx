import { ImageResponse } from "@vercel/og";
import { fallbackResponse, fetchJson, loadPretendardBold, takeResultCode } from "../_og-lib.js";
import type { ResultData } from "../_og-lib.js";
import { PersonColumn } from "../_og-components.js";

export const config = { runtime: "edge" };

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const code = takeResultCode(url.searchParams.get("code"));
  if (!code) return fallbackResponse(origin);

  const data = await fetchJson<ResultData>(`/api/results/${code}`);
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

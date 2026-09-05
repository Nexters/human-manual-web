import { ImageResponse } from "@vercel/og";
import { fallbackResponse, fetchJson, loadPretendardBold, takeResultCode } from "../_og-lib.js";
import type { CompatibilityData } from "../_og-lib.js";
import { PersonColumn } from "../_og-components.js";

export const config = { runtime: "edge" };

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const mine = takeResultCode(url.searchParams.get("mine"));
  const friend = takeResultCode(url.searchParams.get("friend"));
  if (!mine || !friend) return fallbackResponse(origin);

  const data = await fetchJson<CompatibilityData>(
    `/api/compatibility?mine=${mine}&friend=${friend}`,
  );
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

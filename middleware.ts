// 카카오톡·페이스북 등 링크 미리보기 봇은 JS를 실행하지 않고 index.html 의 정적
// <meta og:*> 만 읽는다. 이 미들웨어는 그 봇 요청에 한해, 공유된 결과·케미 데이터로
// og:title/description/image 를 채운 HTML을 대신 응답한다. 일반 사용자는 그대로
// React 앱(index.html)을 받는다 — 아래에서 반환값이 없으면 요청이 통과된다.
export const config = {
  matcher: ["/((?!api/|og/|assets/|favicon|_vercel).*)"],
};

const BOT_UA =
  /kakaotalk-scrap|facebookexternalhit|facebot|twitterbot|slackbot|discordbot|telegrambot|whatsapp|line-poker|skypeuripreview|embedly|redditbot|googlebot|bingbot/i;

const RESULT_CODE_LENGTH = 8;
const RESULT_CODE_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${RESULT_CODE_LENGTH}}$`);

function takeResultCode(value: string | null | undefined): string | null {
  const code = value?.slice(0, RESULT_CODE_LENGTH);
  return code && RESULT_CODE_PATTERN.test(code) ? code : null;
}

async function fetchJson(pathname: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://api.pakit.kr${pathname}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// HTML 속성 안에 그대로 넣을 문자열이므로 escape 필수 (닉네임·headline 등 사용자·서버 문자열).
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface OgMeta {
  image: string;
  title: string;
  description: string;
}

// 카톡 카드 문구는 "호기심 유발" 방향. 명사(noun)에 조사를 직접 붙이면 받침에 따라
// "로봇래요"처럼 깨지므로, adjective 가 수식하는 "장난감이래요" 형태로 회피한다.
function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback;
}

async function resolveOgMeta(url: URL, origin: string): Promise<OgMeta | null> {
  if (url.pathname.startsWith("/result/")) {
    const code = takeResultCode(url.pathname.split("/")[2]);
    if (!code) return null;
    const data = await fetchJson(`/api/results/${code}`);
    if (!data) return null;
    const overview = (data.overview ?? {}) as Record<string, unknown>;
    const participant = (data.participant ?? {}) as Record<string, unknown>;
    const nickname = str(participant.nickname, "친구");
    const noun = str(overview.noun, "장난감");
    const adjective = str(overview.adjective, "나를 닮은");
    const rarity = str(overview.rarity, "");
    return {
      image: `${origin}/api/og/result?code=${code}`,
      title: rarity
        ? `${nickname}님은 ${rarity}의 '${noun}'`
        : `${nickname}님의 장난감은 '${noun}'`,
      description: `${adjective} 장난감이래요. 나는 어떤 장난감일까? 👀`,
    };
  }

  if (url.pathname === "/" && url.searchParams.has("friend")) {
    const code = takeResultCode(url.searchParams.get("friend"));
    if (!code) return null;
    const data = await fetchJson(`/api/results/${code}`);
    if (!data) return null;
    const participant = (data.participant ?? {}) as Record<string, unknown>;
    const nickname = str(participant.nickname, "친구");
    return {
      image: `${origin}/api/og/invite?code=${code}`,
      title: `${nickname}님과의 케미, 궁금하지 않아요?`,
      description: "나랑 얼마나 잘 맞을까? 지금 확인해보세요 👀",
    };
  }

  if (url.pathname === "/compatibility") {
    const mine = takeResultCode(url.searchParams.get("mine"));
    const friend = takeResultCode(url.searchParams.get("friend"));
    if (!mine || !friend) return null;
    const data = await fetchJson(`/api/compatibility?mine=${mine}&friend=${friend}`);
    if (!data) return null;
    const mineP = (data.mine ?? {}) as Record<string, unknown>;
    const friendP = (data.friend ?? {}) as Record<string, unknown>;
    const mineName = str(mineP.nickname, "나");
    const friendName = str(friendP.nickname, "친구");
    const headline = str(data.headline, "우리의 케미");
    return {
      image: `${origin}/api/og/compat?mine=${mine}&friend=${friend}`,
      title: `${mineName}님과 ${friendName}님의 케미 결과가 나왔어요`,
      description: `${headline} — 우리 궁합 자세히 보기 👀`,
    };
  }

  return null;
}

export default async function middleware(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!BOT_UA.test(ua)) return; // 일반 사용자 → 통과, React 앱 그대로

  const url = new URL(req.url);
  const origin = url.origin;

  const og = await resolveOgMeta(url, origin);
  if (!og) return; // 매칭 없음 · 데이터 없음(잘못된 코드 등) → 기본 정적 OG로 통과

  const res = await fetch(`${origin}/index.html`);
  if (!res.ok) return; // index.html 을 못 받으면 봇에게 깨진 HTML 대신 통과
  const html = await res.text();

  // index.html 의 <meta> 태그는 prettier 로 여러 줄에 걸쳐 있을 수 있다
  // (예: <meta\n  property="og:description"\n  content="..."\n/>).
  // 속성 순서·줄바꿈에 관계없이 그 property/name 을 가진 <meta ...> 한 개를 잡는다.
  // [^>]* 는 개행을 포함하므로 여러 줄도 매칭된다. 핵심은 `<meta` 와 속성 사이,
  // 속성들 사이의 공백을 \s+ 로 허용하는 것.
  const metaTag = (attr: string, value: string) =>
    new RegExp(`<meta\\s+[^>]*?${attr}="${value}"[^>]*?/?>`, "i");

  const patched = html
    .replace(
      metaTag("property", "og:title"),
      `<meta property="og:title" content="${esc(og.title)}" />`,
    )
    .replace(
      metaTag("property", "og:description"),
      `<meta property="og:description" content="${esc(og.description)}" />`,
    )
    .replace(metaTag("property", "og:image"), `<meta property="og:image" content="${og.image}" />`)
    .replace(metaTag("property", "og:image:width"), "")
    .replace(metaTag("property", "og:image:height"), "")
    .replace(
      metaTag("name", "twitter:description"),
      `<meta name="twitter:description" content="${esc(og.description)}" />`,
    )
    .replace(
      metaTag("name", "twitter:image"),
      `<meta name="twitter:image" content="${og.image}" />`,
    )
    .replace(
      '<meta property="og:site_name"',
      `<meta property="og:url" content="${esc(req.url)}" />\n    <meta property="og:site_name"`,
    );

  return new Response(patched, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}

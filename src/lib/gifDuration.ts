// GIF89a 스펙의 Graphic Control Extension(21 F9)에서 프레임별 delay time(1/100초 단위)을 읽어
// 전체 재생 시간을 계산한다. <img>는 gif 재생 종료 이벤트를 제공하지 않기 때문에,
// 실제 파일 길이만큼 다음 단계로 넘어가는 타이밍을 맞추기 위해 직접 파싱한다.
const FALLBACK_DURATION_MS = 4000;
const MIN_FRAME_DELAY_MS = 20;

async function fetchGifDurationMs(src: string): Promise<number> {
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let totalMs = 0;
  for (let i = 0; i < bytes.length - 8; i++) {
    // Graphic Control Extension: 0x21 0xF9 0x04
    if (bytes[i] === 0x21 && bytes[i + 1] === 0xf9 && bytes[i + 2] === 0x04) {
      const delayCentiseconds = bytes[i + 4] | (bytes[i + 5] << 8);
      totalMs += Math.max(delayCentiseconds * 10, MIN_FRAME_DELAY_MS);
    }
  }

  return totalMs > 0 ? totalMs : FALLBACK_DURATION_MS;
}

const durationCache = new Map<string, Promise<number>>();

export function getGifDurationMs(src: string): Promise<number> {
  let cached = durationCache.get(src);
  if (!cached) {
    cached = fetchGifDurationMs(src).catch(() => FALLBACK_DURATION_MS);
    durationCache.set(src, cached);
  }
  return cached;
}

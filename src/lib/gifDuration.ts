// GIF89a 스펙의 블록 구조를 순차적으로 따라가며 Graphic Control Extension(21 F9)의
// delay time(1/100초 단위)을 읽어 전체 재생 시간을 계산한다. <img>는 gif 재생 종료 이벤트를
// 제공하지 않기 때문에, 실제 파일 길이만큼 다음 단계로 넘어가는 타이밍을 맞추기 위해 직접 파싱한다.
//
// 무차별 바이트 스캔(0x21 0xF9 0x04 패턴 검색)은 이미지 데이터(LZW 압축 스트림) 안에서
// 같은 바이트 시퀀스가 우연히 등장할 경우 이를 GCE로 오인식해 비정상적으로 큰 delay 값을
// 만들어낼 수 있다. 이를 막기 위해 블록 크기(sub-block length byte)를 따라 정확히 건너뛴다.
const FALLBACK_DURATION_MS = 4000;
const MIN_FRAME_DELAY_MS = 20;

function skipSubBlocks(bytes: Uint8Array, offset: number): number {
  let i = offset;
  while (i < bytes.length) {
    const blockSize = bytes[i];
    i += 1;
    if (blockSize === 0) break;
    i += blockSize;
  }
  return i;
}

function parseGifDurationMs(bytes: Uint8Array): number {
  if (bytes.length < 13 || bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) {
    return FALLBACK_DURATION_MS;
  }

  let totalMs = 0;
  let i = 6;

  const packed = bytes[i + 4];
  i += 7;
  if (packed & 0x80) {
    const gctSize = 2 << (packed & 0x07);
    i += gctSize * 3;
  }

  while (i < bytes.length) {
    const introducer = bytes[i];

    if (introducer === 0x21) {
      const label = bytes[i + 1];
      i += 2;
      if (label === 0xf9) {
        // GCE 레이아웃(현재 i는 block size 바이트를 가리킴):
        // [blockSize=04][packed][delay_lo][delay_hi][transparentIndex][terminator=00]
        const delayCentiseconds = bytes[i + 2] | (bytes[i + 3] << 8);
        totalMs += Math.max(delayCentiseconds * 10, MIN_FRAME_DELAY_MS);
      }
      i = skipSubBlocks(bytes, i);
    } else if (introducer === 0x2c) {
      i += 9;
      const imgPacked = bytes[i];
      i += 1;
      if (imgPacked & 0x80) {
        const lctSize = 2 << (imgPacked & 0x07);
        i += lctSize * 3;
      }
      i += 1;
      i = skipSubBlocks(bytes, i);
    } else if (introducer === 0x3b) {
      break;
    } else {
      break;
    }
  }

  return totalMs > 0 ? totalMs : FALLBACK_DURATION_MS;
}

async function fetchGifDurationMs(src: string): Promise<number> {
  const response = await fetch(src);
  const buffer = await response.arrayBuffer();
  return parseGifDurationMs(new Uint8Array(buffer));
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

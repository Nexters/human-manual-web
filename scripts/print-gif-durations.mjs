#!/usr/bin/env node
// src/assets/gif/unboxing 아래 gif 파일들의 실제 재생 길이(ms)를 계산해 출력한다.
// 조합별 gif 에셋이 교체될 때, src/components/unboxing/unboxingAssets.ts의
// CLOSED_BOX_DURATION_MAP 값을 갱신하기 위해 사용한다.
//
// 사용법: node scripts/print-gif-durations.mjs [gif 디렉토리 경로]
// 기본 경로: src/assets/gif/unboxing
//
// GIF89a 블록 구조(헤더 → GCT → Extension/Image)를 순차적으로 따라가며
// Graphic Control Extension의 delay time을 합산한다. 무차별 바이트 스캔은
// 이미지 데이터(LZW 스트림) 안의 우연한 바이트 패턴을 GCE로 오인식할 수 있어 사용하지 않는다.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const FALLBACK_DURATION_MS = 4000;
const MIN_FRAME_DELAY_MS = 20;

function skipSubBlocks(bytes, offset) {
  let i = offset;
  while (i < bytes.length) {
    const blockSize = bytes[i];
    i += 1;
    if (blockSize === 0) break;
    i += blockSize;
  }
  return i;
}

function parseGifDurationMs(bytes) {
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
    } else {
      break;
    }
  }

  return totalMs > 0 ? totalMs : FALLBACK_DURATION_MS;
}

const dir = process.argv[2] ?? "src/assets/gif/unboxing";
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".gif"))
  .sort();

for (const file of files) {
  const bytes = new Uint8Array(readFileSync(join(dir, file)));
  const ms = parseGifDurationMs(bytes);
  console.log(`${file}: ${ms}ms`);
}

import { toBlob } from "html-to-image";

/** 캡처 대상 DOM을 벗어나지 않도록, 실제 렌더 너비만큼만 잘라낸다. */
async function captureElement(element: HTMLElement) {
  return toBlob(element, {
    // 원격 캐릭터 이미지가 캐시된 채로 CORS 없이 그려지는 걸 막는다.
    cacheBust: true,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    backgroundColor: "#ffffff",
    width: element.scrollWidth,
    height: element.scrollHeight,
  });
}

/**
 * DOM 요소를 이미지로 캡처해 저장한다.
 * 파일 공유가 가능한 환경(대부분의 모바일)에서는 공유 시트를 띄워 "저장"을
 * 고를 수 있게 하고, 그렇지 않으면(데스크톱 등) 바로 다운로드한다.
 */
export async function saveElementAsImage(element: HTMLElement, fileName: string) {
  const blob = await captureElement(element);
  if (!blob) {
    throw new Error("이미지를 만들지 못했어요.");
  }

  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch {
      // 사용자가 공유를 취소한 경우 등은 무시한다.
      return;
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

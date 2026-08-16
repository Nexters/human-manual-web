export type ShareData = {
  title: string;
  text: string;
  url: string;
};

/**
 * Web Share API를 지원하면 시스템 공유 시트를 띄우고,
 * 지원하지 않으면 URL을 클립보드로 복사한다.
 */
export async function share(data: ShareData) {
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      // 사용자가 공유를 취소한 경우 등은 무시한다.
    }
    return;
  }

  await navigator.clipboard.writeText(data.url);
}

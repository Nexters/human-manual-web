export type ShareData = {
  /**
   * 채팅 앱은 title 을 메시지 맨 앞에 그대로 이어붙인다.
   * 문구가 그 자체로 완결된 경우엔 넘기지 않는다.
   */
  title?: string;
  text: string;
  /**
   * 문구(text)에 링크가 이미 들어있으면 넘기지 않는다.
   * 시스템 공유 시트가 text 와 url 을 어떻게 합칠지는 받는 앱이 정하는데,
   * 카카오톡은 url 을 앞에 놓고 구분자도 넣지 않아 문구 첫 글자가 URL 에 눌러붙는다.
   */
  url?: string;
};

/** Web Share API(시스템 공유 시트) 사용 가능 여부. */
export function canUseSystemShare() {
  return typeof navigator.share === "function";
}

/**
 * Web Share API를 지원하면 시스템 공유 시트를 띄우고,
 * 지원하지 않으면 URL을 클립보드로 복사한다.
 */
export async function share(data: ShareData) {
  if (canUseSystemShare()) {
    try {
      await navigator.share(data);
    } catch {
      // 사용자가 공유를 취소한 경우 등은 무시한다.
    }
    return;
  }

  await navigator.clipboard.writeText(data.url ?? data.text);
}

/**
 * 친구 케미 테스트 모달에서 복사·공유하는 문구.
 * 링크에 내 결과 코드를 담아 보내면 받은 친구가 코드를 따로 입력하지 않아도 된다.
 *
 * 모달 표시·클립보드 복사·공유 시트에 모두 쓴다.
 * 링크를 마지막 줄에 넣어 뒤에 아무것도 붙지 않게 하고, 공유 시트에는 이 문구만 넘긴다.
 * 시안(2054:14318)의 문구 박스가 158px 고정이라, 링크까지 한눈에 보이도록 3줄로 맞춘다.
 */
export function buildChemiTestMessage({ resultName, url }: { resultName: string; url: string }) {
  return [`나 '${resultName}' 나왔어.`, "우리 케미는 몇 점일까? 여기서 확인해줘!", url].join("\n");
}

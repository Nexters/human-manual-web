export type ShareData = {
  title: string;
  text: string;
  url: string;
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

  await navigator.clipboard.writeText(data.url);
}

/**
 * 친구 케미 테스트 모달에서 복사·공유하는 문구.
 * 링크에 내 결과 코드를 담아 보내면 받은 친구가 코드를 따로 입력하지 않아도 된다.
 */
function chemiTestLines(resultName: string) {
  return [`나 '${resultName}' 나왔어.`, "우리 케미는 몇 점일까? 여기서 확인해줘!"];
}

/**
 * 시스템 공유 시트의 text 로 넘기는 문구. 링크는 ShareData.url 이 담당한다.
 * 여기에 링크를 넣으면 시트가 url 을 덧붙여 링크가 두 번 들어가고,
 * 붙는 자리에 구분자가 없는 앱에서는 friend 값이 뒷 링크까지 삼켜 깨진다.
 */
export function buildChemiTestShareText(resultName: string) {
  return chemiTestLines(resultName).join("\n");
}

/**
 * 모달 표시·클립보드 복사용 문구. 둘 다 문자열 한 칸뿐이라 링크까지 합쳐서 넘긴다.
 * 시안(2054:14318)의 문구 박스가 158px 고정이라, 링크까지 한눈에 보이도록 3줄로 맞춘다.
 */
export function buildChemiTestMessage({ resultName, url }: { resultName: string; url: string }) {
  return [...chemiTestLines(resultName), url].join("\n");
}

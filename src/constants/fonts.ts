// CSS Font Loading API(document.fonts.load)에 넘길 폰트 shorthand.
// 파일 자체는 src/index.css의 @font-face로 선언되어 있고, 여기서는 그 폰트를
// 미리 내려받거나(첫 화면 프리로드) 다 받아졌는지 기다릴 때(useFontsReady) 쓴다.
export const PRETENDARD_FONT_SPEC = '1em "Pretendard Variable"';
export const WAGURI_FONT_SPEC = "1em Waguri";
export const THE_POSTER_FONT_SPEC = "1em ThePosterFont";

export const ALL_FONT_SPECS = [PRETENDARD_FONT_SPEC, WAGURI_FONT_SPEC, THE_POSTER_FONT_SPEC];

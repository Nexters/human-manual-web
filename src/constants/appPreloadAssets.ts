import { questionAsset, characterAsset } from "@/constants/assets";
import unboxingClosedGif from "@/assets/gif/unboxing.gif";
import deliveryBunnyGif from "@/assets/gif/delivery-bunny.gif";
import roomBg from "@/assets/img/backgrounds/room-bg.png";
import resultCheckIcon from "@/assets/img/result/check.png";
import resultErrorIcon from "@/assets/img/result/error.png";
import resultChargeImg from "@/assets/img/result/charge/charge.png";
import { DETAIL_CONTENT } from "@/components/compatibility/detailAnalysisContent";

// public/assets 는 Vite 모듈 그래프 밖(정적 서빙)이라 questionAsset/characterAsset로 만든
// 경로 문자열을 직접 나열해야 한다. public/assets/question, public/assets/character에
// 파일이 추가·변경되면 이 목록도 함께 갱신해야 한다.
const CHARACTER_VALUES = [
  "foodie",
  "hates_walking",
  "meme_addict",
  "morning_person",
  "no_plan",
  "photo_obsessed",
  "planner",
  "sweet",
];

const QUESTION_ASSETS: [questionId: string, name: string][] = [
  ["step1.q01", "decision"],
  ["step1.q01", "hangout"],
  ["step1.q01", "information"],
  ["step1.q01", "worries"],
  ["step1.q05", "after_waking"],
  ["step1.q05", "after_work"],
  ["step1.q05", "during_meal"],
  ["step1.q05", "late_night"],
  ["step1.q12", "profile"],
  ["step2.q03", "rehearse_with_ai"],
  ["step2.q03", "rehearse_with_ai-selected"],
  ["step2.q03", "send_immediately"],
  ["step2.q03", "send_immediately-selected"],
  ["step2.q06", "main"],
  ["step2.q12", "bubble"],
  ["step2.q12", "press"],
  ["step2.q12", "pressed"],
];

export const questionPreloadImages: string[] = [
  ...QUESTION_ASSETS.map(([questionId, name]) => questionAsset(questionId, name)),
  ...CHARACTER_VALUES.map(characterAsset),
];

// 열림 이미지는 조합별로 16종이라 사전 프리로드 대상에서 제외한다.
// 언박싱 화면 진입 시점에 useAssessmentResult로 조합을 먼저 조회한 뒤 필요한 이미지만 불러온다.
export const unboxingPreloadImages = [unboxingClosedGif, deliveryBunnyGif, roomBg];

export const resultPreloadImages = [resultCheckIcon, resultErrorIcon, resultChargeImg];

export const compatibilityPreloadImages = Object.values(DETAIL_CONTENT).map(
  (content) => content.icon,
);

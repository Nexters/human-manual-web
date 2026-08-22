import spinningTop from "@/assets/img/compatibility-spinning-top.png";
import bearLarge from "@/assets/img/compatibility-bear-large.png";
import type { CompatibilityOutput } from "@/types/compatibility";

// 결과 코드는 정확히 8자(URL-safe)여야 한다 — src/lib/resultCode.ts의
// takeResultCode()가 8자를 넘는 값은 잘라내므로, 캐시에 심어둔 키와
// 실제 쿼리 키가 어긋나 진짜 네트워크 요청이 나가버린다.
export const MOCK_MINE_CODE = "STORYMIN";
export const MOCK_FRIEND_CODE = "STORYFRI";

export const mockCompatibility: CompatibilityOutput = {
  mine: {
    nickname: "지은",
    noun: "팽이",
    character_id: "spinning-top",
    image_url: spinningTop,
  },
  friend: {
    nickname: "선우",
    noun: "곰인형",
    character_id: "bear",
    image_url: bearLarge,
  },
  headline: "티키타카가 즐거운 케미",
  description: "서로 다른 속도지만, 맞춰갈수록 더 즐거워지는 조합이에요.",
  synergy: {
    score: 82,
    title: "케미 지수 82점",
    description: "함께 있을 때 에너지가 배가 되는 사이예요.",
    tags: ["텐션 UP", "티키타카"],
  },
  details: [
    {
      key: "distance",
      score: 70,
      title: "거리감",
      label: "적당히 가까운 사이",
      description: "서로의 공간을 존중하면서도 자주 연락해요.",
    },
    {
      key: "conflict",
      score: 65,
      title: "갈등 대처",
      label: "대화로 푸는 편",
      description: "의견이 다를 때도 차분히 이야기해서 풀어가요.",
    },
    {
      key: "care",
      score: 88,
      title: "배려",
      label: "세심하게 챙겨요",
      description: "작은 것도 놓치지 않고 서로를 챙겨주는 사이예요.",
    },
    {
      key: "pace",
      score: 74,
      title: "속도",
      label: "다르지만 맞춰가요",
      description: "처음엔 속도가 다르지만 점점 리듬이 맞아가요.",
    },
  ],
  tips: [
    {
      target: "mine",
      character_id: "spinning-top",
      image_url: spinningTop,
      title: "먼저 다가가주세요",
      description: "팽이는 표현이 서툴러도 마음은 진심이에요.",
    },
    {
      target: "friend",
      character_id: "bear",
      image_url: bearLarge,
      title: "천천히 기다려주세요",
      description: "곰인형은 준비가 되면 차근차근 마음을 열어요.",
    },
  ],
  relationship_tip: {
    title: "함께 있을 때 기억해주세요",
    description: "서로 다른 속도를 인정하면 더 오래, 더 편하게 만날 수 있어요.",
  },
};

import spinningTop from "@/assets/img/compatibility-spinning-top.png";
import bearLarge from "@/assets/img/compatibility-bear-large.png";
import bearThumbnail from "@/assets/img/compatibility-bear-thumbnail.png";
import type { AssessmentSubmissionOutput } from "@/types/assessment";

/** ResultPage, UnboxingPage 스토리에서 공용으로 쓰는 결과 목 데이터. */
export const MOCK_RESULT_CODE = "STORYMIN";

export const mockAssessmentResult: AssessmentSubmissionOutput = {
  result_code: MOCK_RESULT_CODE,
  participant: { nickname: "지은" },
  overview: {
    rarity: "상위 4%",
    adjective: "새벽 2시에도 카톡 폭격하는",
    noun: "팽이",
    result_name: "팽이 지은",
    character_id: "spinning-top",
    image_url: spinningTop,
    tags: ["도파민 MAX", "장난꾸러기", "혼자서도 잘놀아요"],
  },
  unboxing_kit: {
    axis_scores: {
      attachment: 72,
      expression: 40,
      routine: 65,
      egen: 55,
    },
    packaging: {
      type: "fragile_box",
      name: "취급주의 상자",
      image_url: spinningTop,
      tags: ["직진형"],
      reason:
        "당신은 애정과 관심을 아낌없이 표현하고, 감정도 솔직하게 드러내요. 마음을 크게 담은 만큼 작은 반응에도 쉽게 기뻐하거나 서운해지는 취급주의 상자예요.",
    },
    opening_tool: {
      type: "glove",
      name: "장갑",
      image_url: bearThumbnail,
      tags: ["탐험형"],
      reason:
        "당신은 호기심이 생기면 망설이지 않고 새로운 경험에 뛰어들어요. 평범한 순간도 자신만의 방식으로 흥미롭게 바꾸는 모습이에요.",
    },
  },
  features: [
    {
      title: "분위기를 띄워요",
      description: "재밌는 일이 시작되면 마음 맞는 사람도 불러 함께 즐겨요.",
      tag: "열정",
    },
    {
      title: "고민 대나무 숲",
      description: "말하기 힘든 속마음도 어느새 전부 털어 놓게 만들어요.",
      tag: "고민",
    },
    {
      title: "혼자 곱씹어요",
      description: "충분히 들여다보고, 준비가 되면 차근차근 말해요.",
      tag: "속마음",
    },
    {
      title: "가능성을 봐요",
      description: "사람과 상황에서 펼쳐지지 않은 재미를 먼저 발견해요.",
      tag: "안목",
    },
  ],
  character_story: {
    title: "아무렇게나 다룰 수 없는 자기만의 결, 팽이",
    description:
      "팽이는 단단한 척 버티기보다 섬세한 결을 그대로 가지고 있어요. 작은 자극도 깊이 느끼지만, 그만큼 평범한 순간에서 남들이 놓친 의미와 상상을 발견하죠.",
  },
  can_do: [
    "같이 놀아주세요",
    "새로운 제안을 던져주세요",
    "리액션을 아끼지 말아주세요",
    "자유롭게 맡겨주세요",
  ],
  warnings: [
    "똑같은 일만 반복시켜요",
    "선택을 지나치게 제한해요",
    "재미없는 분위기를 오래 끌어요",
    "아이디어를 시작부터 막아버려요",
  ],
  charging: {
    description: "친구들과 놀 때 가장 빠르게 충전돼요",
    activities: [
      { type: "play_with_friends", label: "친구들과 놀기" },
      { type: "beer", label: "맥주 한 잔" },
      { type: "travel", label: "여행가기" },
    ],
  },
  compatible_friends: [
    {
      badge: "찰떡궁합",
      noun: "곰인형",
      character_id: "bear",
      image_url: bearLarge,
      description: "서로의 아이디어를 키워주는 신나는 조합이에요",
    },
    {
      badge: "환상의 케미",
      noun: "비밀상자",
      character_id: "secret-box",
      image_url: bearThumbnail,
      description: "당신의 아이디어를 깊이 이해하고 방향을 잡아줘요",
    },
  ],
};

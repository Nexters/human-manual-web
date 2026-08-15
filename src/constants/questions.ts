import type { MbtiAxisKey } from "@/types/assessment";

export type ChoiceLayout = "grid" | "card" | "chip" | "bubble" | "pairCard" | "list" | "duo";

export type ChoiceOption = { value: string; label: string };

export type CarouselOption = {
  value: string;
  name: string;
  quote: string;
  ctaLabel: string;
};

export type QuestionDef =
  | {
      order: number;
      questionId: string;
      kind: "choice";
      layout: ChoiceLayout;
      title: string;
      background?: "gray" | "white";
      options: ChoiceOption[];
    }
  | {
      order: number;
      questionId: string;
      kind: "carousel";
      title: string;
      background?: "gray" | "white";
      ctaTone?: "main" | "point";
      options: CarouselOption[];
    }
  | {
      order: number;
      questionId: string;
      kind: "scale";
      title: string;
      hint: string;
      minLabel: string;
      maxLabel: string;
    }
  | {
      order: number;
      questionId: string;
      kind: "integer";
      title: string;
      placeholder: string;
    }
  | {
      order: number;
      questionId: string;
      kind: "action";
      title: string;
      bubble: string;
      pressedTitle: string;
      pressValue: string;
      skipValue: string;
      skipLabel: string;
      nextLabel: string;
    }
  | {
      order: number;
      questionId: null;
      kind: "mbti";
      title: string;
      axes: readonly MbtiAxisKey[];
    };

export const TOTAL_STEPS = 23;

export const QUESTIONS: QuestionDef[] = [
  {
    order: 1,
    questionId: "step1.q01",
    kind: "choice",
    layout: "grid",
    title: "친구들이 나를\n찾는 순간은 언제인가요?",
    options: [
      { value: "restaurant", label: "맛집 정할 때" },
      { value: "worries", label: "고민 있을 때" },
      { value: "hangout", label: "놀 사람 필요할 때" },
      { value: "information", label: "정보 필요할 때" },
    ],
  },
  {
    order: 2,
    questionId: "step1.q02",
    kind: "choice",
    layout: "list",
    title: "가장 자신있는 것은 무엇인가요?",
    options: [
      { value: "navigation", label: "길찾기" },
      { value: "lift_mood", label: "분위기 살리기" },
      { value: "planning", label: "계획 짜기" },
      { value: "reacting", label: "리액션하기" },
      { value: "mediate_conflict", label: "싸움 말리기" },
      { value: "choose_gift", label: "선물 고르기" },
    ],
  },
  {
    order: 3,
    questionId: "step1.q03",
    kind: "choice",
    layout: "list",
    background: "white",
    title: "남들은 이해 못하는 습관이 있나요?",
    options: [
      { value: "save_favorites", label: "좋아하는 물건은 아까워서\n쉽게 사용하지 못한다" },
      { value: "multiple_alarms", label: "알람을 하나보다 여러 개\n맞춰두는 편이다" },
      { value: "duplicate_clothes", label: "마음에 드는 옷은 같은 걸\n여러 벌 사는 편이다" },
      { value: "check_spoilers", label: "영화를 보기 전에 결말을\n먼저 찾아보는 편이다" },
    ],
  },
  {
    order: 4,
    questionId: "step1.q04",
    kind: "choice",
    layout: "bubble",
    title: "자주 듣는 잔소리는 무엇인가요?",
    options: [
      { value: "phone_overuse", label: "폰 좀 그만봐 뚫리겠다." },
      { value: "sleep_late", label: "니가 올빼미냐 잠 좀 자" },
      { value: "overspending", label: "거지가 꿈이니?" },
      { value: "slow_reply", label: "읽씹 ㄴㄴ 대답 좀 해라" },
      { value: "messy_room", label: "돼지우리냐 방 좀 치우고 살아라" },
      { value: "low_battery", label: "폰 충전 좀 해라" },
    ],
  },
  {
    order: 5,
    questionId: "step1.q05",
    kind: "choice",
    layout: "card",
    title: "하루 중 절대 건드리면\n안 되는 시간은 언제인가요?",
    options: [
      { value: "after_waking", label: "기상 직후" },
      { value: "during_meal", label: "밥 먹을 때" },
      { value: "after_work", label: "퇴근 직후" },
      { value: "late_night", label: "새벽 감성 타임" },
    ],
  },
  {
    order: 6,
    questionId: "step1.q06",
    kind: "choice",
    layout: "list",
    background: "white",
    title: "{nickname}님을 화나게 하는 가장 빠른 방법",
    options: [
      { value: "rush", label: "재촉하기" },
      { value: "interrupt", label: "말 끊기" },
      { value: "take_food", label: "음식 뺏어먹기" },
      { value: "arrive_late", label: "약속 늦기" },
      { value: "nag", label: "잔소리" },
      { value: "change_plan", label: "내 계획 바꾸기" },
    ],
  },
  {
    order: 7,
    questionId: "step1.q07",
    kind: "choice",
    layout: "chip",
    background: "white",
    title: "기다리고 기다리던 휴일,\n{nickname}님의 첫 스케줄은 무엇인가요?",
    options: [
      { value: "sleep_until_noon", label: "낮 12시 기상" },
      { value: "morning_run", label: "아침 러닝" },
      { value: "brunch_cafe", label: "브런치 카페" },
      { value: "stay_in_bed", label: "이불 밖은 위험해" },
      { value: "watch_streaming", label: "밀린 OTT 시청" },
      { value: "self_development", label: "자기개발" },
    ],
  },
  {
    order: 8,
    questionId: "step1.q08",
    kind: "choice",
    layout: "list",
    background: "white",
    title: "금요일 저녁,\n약속이 갑자기 취소됐을 때 {nickname}님은",
    options: [
      { value: "go_to_bed", label: "개꿀! 당장 침대로 간다" },
      { value: "contact_others", label: "다른 친구한테 연락 돌린다" },
      { value: "eat_alone", label: "혼자라도 식당 가서 먹고 온다" },
      { value: "go_for_drive", label: "이 때다, 안 가 본 곳으로 드라이브!" },
    ],
  },
  {
    order: 9,
    questionId: "step1.q09",
    kind: "carousel",
    title: "{nickname}님은 어떤 친구랑\n오랫동안 놀 수 있나요?",
    options: [
      {
        value: "tsundere",
        name: "츤데레",
        quote: "…딱히 같이 놀고 싶은 건 아니야",
        ctaLabel: "츤데레 친구와 놀래요!",
      },
      {
        value: "planner",
        name: "계획형",
        quote: "우리 다음 약속은 이미 잡아뒀어",
        ctaLabel: "계획형 친구와 놀래요!",
      },
      {
        value: "meme_addict",
        name: "밈 중독자",
        quote: "나 오늘 완전 야르한 말랑이 샀음 아자스!",
        ctaLabel: "밈 중독자 친구와 놀래요!",
      },
      {
        value: "foodie",
        name: "먹짱",
        quote: "일단 밥부터 먹자",
        ctaLabel: "먹짱 친구와 놀래요!",
      },
    ],
  },
  {
    order: 10,
    questionId: "step1.q10",
    kind: "carousel",
    ctaTone: "point",
    title: "이 친구랑은 절대\n같이 여행가기 싫다!",
    options: [
      {
        value: "morning_person",
        name: "아침형 인간",
        quote: "준비 아직도 안 했어?",
        ctaLabel: "아침형 인간 싫어요",
      },
      {
        value: "no_plan",
        name: "무계획형",
        quote: "일단 Go.",
        ctaLabel: "무계획형 싫어요",
      },
      {
        value: "photo_obsessed",
        name: "사진 집착러",
        quote: "이번엔 인스타 스토리용으로 찍어줘",
        ctaLabel: "사진 집착러 싫어요",
      },
      {
        value: "hates_walking",
        name: "걷기 싫어하는 친구",
        quote: "5분이나 걸어? 택시타자",
        ctaLabel: "걷기 싫어하는 친구 싫어요",
      },
    ],
  },
  {
    order: 11,
    questionId: "step2.q01",
    kind: "choice",
    layout: "duo",
    title: '"어? 저 사람 마음에 드는데?"\n{nickname}님의 첫 반응은?',
    options: [
      { value: "inspect_profile", label: "정독하며 성향 파악부터!\n프로필부터 터는 SNS 염탐형" },
      { value: "approach_directly", label: "“오늘 시간 되세요?”\n바로 직진하는 불도저형" },
    ],
  },
  {
    order: 12,
    questionId: "step2.q02",
    kind: "choice",
    layout: "duo",
    title: '"방금 그 말, 좀 서운한데..."\n대처 방식은?',
    options: [
      {
        value: "hint_and_wait",
        label: "'내가 왜 이러는지 알아채봐'\n말없이 티 내며 삭히는 고구마형",
      },
      {
        value: "resolve_immediately",
        label: '"방금 그 말 무슨 뜻이야?"\n그자리에서 풀어야 하는 사이다형',
      },
    ],
  },
  {
    order: 13,
    questionId: "step2.q03",
    kind: "choice",
    layout: "pairCard",
    title: "친구랑 싸웠을 때\n전송 버튼을 누르기 직전 {nickname}님은?",
    options: [
      { value: "rehearse_with_ai", label: "AI랑 몇번이고 상담한다" },
      { value: "send_immediately", label: "고민 없이 바로 보낸다" },
    ],
  },
  {
    order: 14,
    questionId: "step2.q04",
    kind: "scale",
    title: "연애할 때, 우리 사이는\n어느 정도가 편한가요?",
    hint: "원을 움직여 원하는 거리에 놓아보세요",
    minLabel: "밀착형",
    maxLabel: "독립형",
  },
  {
    order: 15,
    questionId: "step2.q05",
    kind: "choice",
    layout: "duo",
    title: "소소한 일상,\n얼마나 공유하나요?",
    options: [
      { value: "share_everything", label: '"오늘 뭐 먹었는지까지 다 말해야지!"' },
      { value: "share_selectively", label: '"굳이 하나하나 보고할 필요는 없잖아?"' },
    ],
  },
  {
    order: 16,
    questionId: "step2.q06",
    kind: "integer",
    title: "지금 쌓여있는 카톡 개수는?",
    placeholder: "000",
  },
  {
    order: 17,
    questionId: "step2.q07",
    kind: "choice",
    layout: "duo",
    title: "드디어 첫 자취 시작!\n어떻게 방을 꾸미실 건가요?",
    options: [
      { value: "decorate_for_mood", label: "조명 하나, 포스터 하나까지 감성은 필수" },
      { value: "essentials_only", label: "매트리스랑 가전만 있으면 생활 쌉가능" },
    ],
  },
  {
    order: 18,
    questionId: "step2.q08",
    kind: "choice",
    layout: "duo",
    title: "누군가를 챙기거나 애정을\n표현할 때 어떻게 하나요?",
    options: [
      { value: "express_with_words", label: "다정한 말투, 폭풍 리액션,\n눈빛과 표현으로 채운다" },
      {
        value: "express_with_actions",
        label: "말은 별로 없지만 슬쩍 챙겨주거나\n행동으로 보여준다",
      },
    ],
  },
  {
    order: 19,
    questionId: "step2.q09",
    kind: "choice",
    layout: "duo",
    title: "어젯밤 내가 단톡방에 보낸 드립에\n그 누구도 관심 주지 않았을 때,",
    options: [
      { value: "ruminate", label: "‘괜히 보냈나...’\n계속해서 곱씹어본다" },
      { value: "forget_quickly", label: "보낸 기억도 없다" },
    ],
  },
  {
    order: 20,
    questionId: "step2.q10",
    kind: "choice",
    layout: "duo",
    title: "자주 가던 단골카페에\n새로운 메뉴가 생겼다.",
    options: [
      {
        value: "order_familiar_menu",
        label: "괜히 먹었다가 맛 없으면 어떡해?\n원래 계속 먹던 거 또 시켜 먹는다",
      },
      { value: "try_new_menu", label: "안 먹어본 신메뉴가 나왔다고?\n일단 도전해보자!" },
    ],
  },
  {
    order: 21,
    questionId: "step2.q11",
    kind: "choice",
    layout: "duo",
    title: "배달 앱 최근 주문\n내역에 들어가보세요.",
    options: [
      { value: "order_familiar_stores", label: "늘 시키던 맛집 몇 곳만\n돌아가며 주문한다." },
      { value: "try_new_store", label: "리뷰가 없어도\n새로운 가게를 도전한다." },
    ],
  },
  {
    order: 22,
    questionId: "step2.q12",
    kind: "action",
    title: "{nickname}님 앞에 나타난\n‘절대 누르지 마세요’ 버튼!",
    bubble: "버튼 눌러보기",
    pressedTitle: "궁금한 건 직접 눌러봐야\n직성이 풀리는 타입이시군요?",
    pressValue: "press",
    skipValue: "skip",
    skipLabel: "그냥 지나가기",
    nextLabel: "다음",
  },
  {
    order: 23,
    questionId: null,
    kind: "mbti",
    title: "당신의 MBTI를 선택해주세요",
    axes: ["EI", "SN", "TF", "JP"],
  },
];

export const getQuestion = (order: number): QuestionDef | undefined => {
  return QUESTIONS.find((q) => q.order === order);
};

export const fillNickname = (text: string, nickname: string): string => {
  return text.replaceAll("{nickname}", nickname);
};

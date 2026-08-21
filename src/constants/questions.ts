import contentJson from "./assessment-content.v1.json";
import type { AssessmentContent, ContentQuestion, MbtiAxisKey } from "@/types/assessment";

export const CONTENT = contentJson as unknown as AssessmentContent;

export const CONTENT_BY_ID = new Map<string, ContentQuestion>(
  CONTENT.questions.map((question) => [question.question_id, question]),
);

export type ChoiceLayout = "grid" | "card" | "chip" | "bubble" | "pairCard" | "list" | "duo";

export type ChoiceOption = { value: string; label: string };

export type CarouselOption = {
  value: string;
  characterId: string;
  name: string;
  quote: string;
  ctaLabel: string;
};

type MetaBase = {
  order: number;
  questionId: string;
  titleWrap?: string;
  optionWrap?: Record<string, string>;
  background?: "gray" | "white";
};

export type QuestionMeta =
  | (MetaBase & { kind: "choice"; layout: ChoiceLayout })
  | (MetaBase & {
      kind: "carousel";
      ctaTone?: "main" | "point";
      characters: Record<string, { characterId: string; name: string; ctaLabel: string }>;
    })
  | (MetaBase & { kind: "scale" })
  | (MetaBase & { kind: "integer" })
  | (MetaBase & {
      kind: "action";
      bubble: string;
      pressedTitle: string;
      pressValue: string;
      skipValue: string;
      skipLabel: string;
      nextLabel: string;
    })
  | { order: number; questionId: null; kind: "mbti"; axes: readonly MbtiAxisKey[] };

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

export const QUESTION_META: QuestionMeta[] = [
  {
    order: 1,
    questionId: "step1.q01",
    kind: "choice",
    layout: "grid",
    titleWrap: "친구들이 나를\n찾는 순간은 언제인가요?",
  },
  {
    order: 2,
    questionId: "step1.q05",
    kind: "choice",
    layout: "card",
    titleWrap: "하루 중 절대 건드리면\n안 되는 시간은 언제인가요?",
  },
  {
    order: 3,
    questionId: "step1.q06",
    kind: "choice",
    layout: "list",
    background: "white",
    titleWrap: "{nickname}님을 화나게 하는\n가장 빠른 방법",
  },
  {
    order: 4,
    questionId: "step1.q07",
    kind: "choice",
    layout: "chip",
    background: "white",
    titleWrap: "기다리고 기다리던 휴일,\n{nickname}님의 첫 스케줄은 무엇인가요?",
  },
  {
    order: 5,
    questionId: "step1.q08",
    kind: "choice",
    layout: "list",
    background: "white",
    titleWrap: "금요일 저녁,\n약속이 갑자기 취소됐을 때 {nickname}님은?",
  },
  {
    order: 6,
    questionId: "step1.q12",
    kind: "choice",
    layout: "bubble",
    titleWrap: "기분이 안 좋을 때,\n가장 반가운 친구의 연락은?",
  },
  {
    order: 7,
    questionId: "step1.q11",
    kind: "choice",
    layout: "chip",
    background: "white",
    titleWrap: "집에만 있으려던 주말,\n나를 밖으로 나오게 한 건?",
  },
  {
    order: 8,
    questionId: "step1.q02",
    kind: "carousel",
    ctaTone: "point",
    titleWrap: "친구들과 있을 때,\n{nickname}님과 가장 닮은 토키는?",
    characters: {
      care_for_others: { characterId: "sweet", name: "스윗 토키", ctaLabel: "관심·배려 토키" },
      organize_and_coordinate: { characterId: "planner", name: "척척 토키", ctaLabel: "정리·조율 토키" },
      lift_mood: { characterId: "meme_addict", name: "깔깔 토키", ctaLabel: "분위기 전환 토키" },
      make_it_happen: {
        characterId: "morning_person",
        name: "직진 토키",
        ctaLabel: "실행·추진 토키",
      },
    },
  },
  {
    order: 9,
    questionId: "step2.q01",
    kind: "choice",
    layout: "duo",
    titleWrap: '"어? 저 사람 마음에 드는데?"\n{nickname}님의 첫 반응은?',
    optionWrap: {
      inspect_profile: "정독하며 성향 파악부터!\n프로필부터 터는 SNS 염탐형",
      approach_directly: "“오늘 시간 되세요?”\n바로 직진하는 돌진형",
    },
  },
  {
    order: 10,
    questionId: "step2.q02",
    kind: "choice",
    layout: "duo",
    titleWrap: '"방금 그 말, 좀 서운한데..."\n대처 방식은?',
    optionWrap: {
      hint_and_wait: "'내가 왜 이러는지 알아채봐'\n말없이 티 내며 삭히는 고구마형",
      resolve_immediately: '"방금 그 말 무슨 뜻이야?"\n그자리에서 풀어야 하는 사이다형',
    },
  },
  {
    order: 11,
    questionId: "step2.q03",
    kind: "choice",
    layout: "pairCard",
    titleWrap: "친구랑 싸웠을 때\n전송 버튼을 누르기 직전 {nickname}님은?",
  },
  {
    order: 12,
    questionId: "step2.q04",
    kind: "scale",
    titleWrap: "연애할 때, 우리 사이는\n어느 정도가 편한가요?",
  },
  {
    order: 13,
    questionId: "step2.q05",
    kind: "choice",
    layout: "duo",
    titleWrap: "소소한 일상,\n얼마나 공유하나요?",
  },
  {
    order: 14,
    questionId: "step2.q06",
    kind: "integer",
  },
  {
    order: 15,
    questionId: "step2.q10",
    kind: "choice",
    layout: "duo",
    titleWrap: "자주 가던 단골카페에\n새로운 메뉴가 생겼다.",
    optionWrap: {
      order_familiar_menu: "괜히 먹었다가 맛 없으면 어떡해?\n원래 계속 먹던 거 또 시켜 먹는다",
      try_new_menu: "안 먹어본 신메뉴가 나왔다고?\n일단 도전해보자!",
    },
  },
  {
    order: 16,
    questionId: "step2.q07",
    kind: "choice",
    layout: "duo",
    titleWrap: "드디어 첫 자취 시작!\n어떻게 방을 꾸미실 건가요?",
  },
  {
    order: 17,
    questionId: "step2.q08",
    kind: "choice",
    layout: "duo",
    titleWrap: "누군가를 챙기거나 애정을\n표현할 때 어떻게 하나요?",
    optionWrap: {
      express_with_words: "다정한 말투, 폭풍 리액션,\n눈빛과 표현으로 채운다",
      express_with_actions: "말은 별로 없지만 슬쩍 챙겨주거나\n행동으로 보여준다",
    },
  },
  {
    order: 18,
    questionId: "step2.q09",
    kind: "choice",
    layout: "duo",
    titleWrap: "어젯밤 내가 단톡방에 보낸 드립에\n그 누구도 관심 주지 않았을 때,",
    optionWrap: {
      ruminate: "‘괜히 보냈나...’\n계속해서 곱씹어본다",
    },
  },
  {
    order: 19,
    questionId: "step2.q11",
    kind: "choice",
    layout: "duo",
    titleWrap: "배달 앱 최근 주문\n내역에 들어가보세요.",
    optionWrap: {
      order_familiar_stores: "늘 시키던 맛집 몇 곳만\n돌아가며 주문한다.",
      try_new_store: "리뷰가 없어도\n새로운 가게를 도전한다.",
    },
  },
  {
    order: 20,
    questionId: "step2.q12",
    kind: "action",
    titleWrap: "{nickname}님 앞에 나타난\n금지 버튼, 누르실건가요?",
    bubble: "버튼 눌러보기",
    pressedTitle: "궁금한 건 직접 눌러봐야\n직성이 풀리는 타입이시군요?",
    pressValue: "press",
    skipValue: "skip",
    skipLabel: "누르지 않고 지나가기",
    nextLabel: "다음",
  },
  {
    order: 21,
    questionId: null,
    kind: "mbti",
    axes: ["EI", "SN", "TF", "JP"],
  },
];

export const TOTAL_STEPS = QUESTION_META.length;

const titleOf = (meta: QuestionMeta): string => {
  if (meta.questionId === null) return CONTENT.mbti_screen.prompt;
  return meta.titleWrap ?? CONTENT_BY_ID.get(meta.questionId)?.prompt ?? "";
};

const optionsOf = (meta: MetaBase): ChoiceOption[] => {
  const options = CONTENT_BY_ID.get(meta.questionId)?.options ?? [];
  return options.map((option) => ({
    value: option.value,
    label: meta.optionWrap?.[option.value] ?? option.label,
  }));
};

const resolve = (meta: QuestionMeta): QuestionDef => {
  const title = titleOf(meta);

  switch (meta.kind) {
    case "choice":
      return {
        order: meta.order,
        questionId: meta.questionId,
        kind: "choice",
        layout: meta.layout,
        title,
        background: meta.background,
        options: optionsOf(meta),
      };
    case "carousel":
      return {
        order: meta.order,
        questionId: meta.questionId,
        kind: "carousel",
        title,
        background: meta.background,
        ctaTone: meta.ctaTone,
        options: optionsOf(meta).map((option) => ({
          value: option.value,
          characterId: meta.characters[option.value]?.characterId ?? option.value,
          name: meta.characters[option.value]?.name ?? "",
          quote: option.label,
          ctaLabel: meta.characters[option.value]?.ctaLabel ?? "",
        })),
      };
    case "scale": {
      const content = CONTENT_BY_ID.get(meta.questionId);
      return {
        order: meta.order,
        questionId: meta.questionId,
        kind: "scale",
        title,
        hint: content?.instruction ?? "",
        minLabel: content?.visual_endpoints?.left ?? "",
        maxLabel: content?.visual_endpoints?.right ?? "",
      };
    }
    case "integer":
      return {
        order: meta.order,
        questionId: meta.questionId,
        kind: "integer",
        title,
      };
    case "action":
      return {
        order: meta.order,
        questionId: meta.questionId,
        kind: "action",
        title,
        bubble: meta.bubble,
        pressedTitle: meta.pressedTitle,
        pressValue: meta.pressValue,
        skipValue: meta.skipValue,
        skipLabel: meta.skipLabel,
        nextLabel: meta.nextLabel,
      };
    case "mbti":
      return {
        order: meta.order,
        questionId: null,
        kind: "mbti",
        title,
        axes: meta.axes,
      };
  }
};

export const QUESTIONS: QuestionDef[] = [...QUESTION_META]
  .sort((a, b) => a.order - b.order)
  .map(resolve);

export const getQuestion = (order: number): QuestionDef | undefined => {
  return QUESTIONS.find((q) => q.order === order);
};

export const fillNickname = (text: string, nickname: string): string => {
  return text.replaceAll("{nickname}", nickname);
};

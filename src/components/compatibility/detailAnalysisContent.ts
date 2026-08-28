import distanceIcon from "@/assets/img/compatibility/distance.png";
import conflictIcon from "@/assets/img/compatibility/conflict.png";
import careIcon from "@/assets/img/compatibility/care.png";
import paceIcon from "@/assets/img/compatibility/pace.png";
import type { CompatibilityDetailOutput } from "@/types/compatibility";

type DetailKey = CompatibilityDetailOutput["key"];

type DetailContent = {
  icon: string;
  /** 아코디언 헤더에 그대로 쓰는 질문형 제목. */
  question: string;
};

// 아코디언 제목·아이콘은 Figma 시안(2945:17757)에 고정된 문구라 서버 데이터 대신
// key별 상수로 관리한다. description만 서버 값을 그대로 쓴다.
export const DETAIL_CONTENT: Record<DetailKey, DetailContent> = {
  distance: {
    icon: distanceIcon,
    question: "우리 사이의 거리감은?",
  },
  conflict: {
    icon: conflictIcon,
    question: "서운함을 푸는 속도는?",
  },
  care: {
    icon: careIcon,
    question: "마음을 주고 받는 방식은?",
  },
  pace: {
    icon: paceIcon,
    question: "함께 노는 방식은?",
  },
};

export const DETAIL_ORDER: DetailKey[] = ["distance", "conflict", "care", "pace"];

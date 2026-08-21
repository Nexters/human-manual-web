import distanceIcon from "@/assets/img/compatibility/distance.png";
import conflictIcon from "@/assets/img/compatibility/conflict.png";
import careIcon from "@/assets/img/compatibility/care.png";
import paceIcon from "@/assets/img/compatibility/pace.png";
import type { CompatibilityDetailOutput } from "@/types/compatibility";

type DetailKey = CompatibilityDetailOutput["key"];

type DetailContent = {
  icon: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
};

// 카드 제목·강조 단어·아이콘은 Figma 시안(2028:5168)에 고정된 문구라 서버 데이터
// 대신 key별 상수로 관리한다. description만 서버 값을 그대로 쓴다.
export const DETAIL_CONTENT: Record<DetailKey, DetailContent> = {
  distance: {
    icon: distanceIcon,
    titleBefore: "우리 사이의 ",
    titleHighlight: "거리감",
    titleAfter: "",
  },
  conflict: {
    icon: conflictIcon,
    titleBefore: "",
    titleHighlight: "서운함",
    titleAfter: "을 푸는 속도",
  },
  care: {
    icon: careIcon,
    titleBefore: "",
    titleHighlight: "마음",
    titleAfter: "을 주고 받는 방식",
  },
  pace: {
    icon: paceIcon,
    titleBefore: "함께 ",
    titleHighlight: "노는",
    titleAfter: " 방식",
  },
};

export const DETAIL_ORDER: DetailKey[] = ["distance", "conflict", "care", "pace"];

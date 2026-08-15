import type { ReactNode } from "react";
import onboardingBg from "@/assets/img/onboarding-bg.jpg";
import characterGreeting from "@/assets/gif/character-greeting.gif";
import characterSurprised from "@/assets/gif/character-surprised.gif";
import characterGuide from "@/assets/gif/character-guide.gif";

export type IntroKey = "greeting" | "surprised" | "guide";

export const introOrder: IntroKey[] = ["greeting", "surprised", "guide"];

export const introSteps: Record<
  IntroKey,
  { background: string; character: string; message: ReactNode; buttonLabel: string }
> = {
  greeting: {
    background: onboardingBg,
    character: characterGreeting,
    message: (
      <>
        안녕하세요! 저는 당신만의 장난감을 만들어 배송하는
        <span className="text-sub-4 font-bold"> 배달원 토키</span>에요
      </>
    ),
    buttonLabel: "다음",
  },
  surprised: {
    background: onboardingBg,
    character: characterSurprised,
    message: "어릴 적 가지고 놀던 장난감처럼 가장 나다운 모습을 다시 꺼내볼 시간이에요",
    buttonLabel: "다음",
  },
  guide: {
    background: onboardingBg,
    character: characterGuide,
    message: "당신을 닮은 장난감을 배송받으러 가볼까요?",
    buttonLabel: "좋아요!",
  },
};

export const introCharacterImages = [characterGreeting, characterSurprised, characterGuide];

export const introBackgroundImages = [onboardingBg];

export const introPreloadImages = [...introBackgroundImages, ...introCharacterImages];

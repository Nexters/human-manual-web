import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/shared/Button";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import SpeechBubble from "@/components/onboarding/SpeechBubble";
import { cn } from "@/lib/cn";
import logo from "@/assets/img/logo.png";
import splashBunny from "@/assets/img/splash-bunny.png";
import onboardingBg from "@/assets/img/onboarding-bg.jpg";
import notebookBg from "@/assets/img/notebook-bg.jpg";
import characterGreeting from "@/assets/gif/character-greeting.gif";
import characterSurprised from "@/assets/gif/character-surprised.gif";
import characterGuide from "@/assets/gif/character-guide.gif";

type IntroKey = "greeting" | "surprised" | "guide";
type Step = "splash-logo" | "splash-cta" | IntroKey | "name-input";

const introOrder: IntroKey[] = ["greeting", "surprised", "guide"];

const introSteps: Record<
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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("splash-logo");
  const [name, setName] = useState("");

  useEffect(() => {
    if (step !== "splash-logo") return;
    const timer = setTimeout(() => setStep("splash-cta"), 2000);
    return () => clearTimeout(timer);
  }, [step]);

  if (step === "splash-logo" || step === "splash-cta") {
    return (
      <AnimatePresence mode="wait">
        {step === "splash-logo" ? (
          <motion.div
            key="splash-logo"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex h-full min-h-dvh flex-col bg-white"
          >
            <SplashHeader />
            <img src={splashBunny} alt="" className="mt-auto w-full" />
          </motion.div>
        ) : (
          <motion.div
            key="splash-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex h-full min-h-dvh flex-col bg-white"
          >
            <SplashHeader />
            <div className="mt-auto flex flex-col gap-3 px-5 pb-10">
              <Button onClick={() => setStep("greeting")}>테스트 시작하기</Button>
              <Button variant="outline" onClick={() => {}}>
                친구와의 궁합보기
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (step === "name-input") {
    return (
      <div className="relative flex h-full min-h-dvh flex-col overflow-hidden">
        <img src={notebookBg} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex flex-1 flex-col justify-between px-5 pt-[95px] pb-10">
          <SpeechBubble
            message={
              <div className="flex flex-col gap-1">
                <Typography variant="h3">배송 전에 이름부터 확인할게요!</Typography>
                <Typography variant="sb4" className="text-gray-07 font-normal">
                  당신의 이름을 알려주세요
                </Typography>
              </div>
            }
          />
          <TextField
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative px-5 pb-10">
          <Button className="w-full" disabled={!name.trim()} onClick={() => navigate("/question")}>
            다음
          </Button>
        </div>
      </div>
    );
  }

  const introIndex = introOrder.indexOf(step);
  const intro = introSteps[step];

  return (
    <div className="relative flex h-full min-h-dvh flex-col overflow-hidden">
      <img src={intro.background} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-white/10" />
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        aria-label="뒤로가기"
        onClick={() => introIndex > 0 && setStep(introOrder[introIndex - 1])}
        className={cn("relative z-10 mt-[15px] ml-5 text-white", introIndex === 0 && "invisible")}
      >
        <ChevronLeftIcon className="size-[30px]" />
      </motion.button>
      <div className="relative flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[360px] w-[260px] overflow-hidden"
          >
            <img src={intro.character} alt="" className="size-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative flex flex-col gap-6 px-5 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SpeechBubble message={intro.message} />
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="w-[104px] shrink-0"
            onClick={() => setStep("name-input")}
          >
            SKIP
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (introIndex < introOrder.length - 1) {
                setStep(introOrder[introIndex + 1]);
              } else {
                setStep("name-input");
              }
            }}
          >
            {intro.buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SplashHeader() {
  return (
    <div className="flex flex-col items-center gap-2 pt-[125px]">
      <img src={logo} alt="Pakit" className="w-[243px]" />
      <Typography variant="sb2" className="text-gray-07">
        나를 닮은 장난감을 만나다
      </Typography>
    </div>
  );
}

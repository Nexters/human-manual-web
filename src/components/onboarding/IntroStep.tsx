import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/shared/Button";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import SpeechBubble from "@/components/onboarding/SpeechBubble";
import { introOrder, introSteps, type IntroKey } from "@/components/onboarding/introSteps";
import { cn } from "@/lib/cn";

type IntroStepProps = {
  step: IntroKey;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function IntroStep({ step, onBack, onNext, onSkip }: IntroStepProps) {
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
        onClick={onBack}
        className={cn(
          "relative z-10 mt-[15px] ml-5 flex size-[30px] items-center justify-center text-white",
          introIndex === 0 && "invisible",
        )}
      >
        <ChevronLeftIcon className="w-[10px]" />
      </motion.button>
      <div className="relative flex flex-1 items-end justify-center pb-[6px]">
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
          <Button variant="ghost" className="w-[104px] shrink-0" onClick={onSkip}>
            SKIP
          </Button>
          <Button className="flex-1" onClick={onNext}>
            {intro.buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

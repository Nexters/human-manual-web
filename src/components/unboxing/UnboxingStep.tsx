import { AnimatePresence, motion } from "framer-motion";
import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import UnboxingBadgeCard from "./UnboxingBadgeCard";
import { getClosedBoxAsset, getOpenBoxAsset } from "./unboxingAssets";
import roomBg from "@/assets/img/backgrounds/room-bg.png";

type UnboxingStepProps = {
  phase: "loading" | "done";
  onConfirm: () => void;
};

export default function UnboxingStep({ phase, onConfirm }: UnboxingStepProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <img
        src={roomBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] justify-center px-5 pt-[143px]">
        <UnboxingBadgeCard
          message={phase === "loading" ? "두구두구두구..." : "택배 상자가 열렸어요! 확인해볼까요?"}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          src={phase === "loading" ? getClosedBoxAsset() : getOpenBoxAsset()}
          alt=""
          className="absolute left-1/2 top-[317px] z-10 w-[377px] -translate-x-1/2"
        />
      </AnimatePresence>
      {phase === "done" && (
        <div className="fixed bottom-8 left-1/2 w-full max-w-[440px] -translate-x-1/2 px-5">
          <QuestionCtaButton onClick={onConfirm}>장난감 확인하기</QuestionCtaButton>
        </div>
      )}
    </div>
  );
}

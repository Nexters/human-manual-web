import { motion } from "framer-motion";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import Typography from "@/components/shared/Typography";
import partIntroBg from "@/assets/img/part-intro-bg.jpg";
import characterNotebook from "@/assets/gif/character-notebook.gif";

type PartIntroStepProps = {
  onBack: () => void;
  onNext: () => void;
};

export default function PartIntroStep({ onBack, onNext }: PartIntroStepProps) {
  return (
    <div className="relative flex h-full min-h-dvh flex-col overflow-hidden">
      <img src={partIntroBg} alt="" className="absolute inset-0 size-full object-cover" />

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="text-gray-08 relative z-10 mt-[15px] ml-5"
      >
        <ChevronLeftIcon className="size-[30px]" />
      </motion.button>

      <div className="relative z-10 flex flex-1 flex-col items-center px-5 pt-6">
        <div className="bg-gray-00 relative w-full rounded-[15px] pt-8 pb-5 text-center">
          <span
            className="bg-point absolute top-0 left-1/2 inline-flex h-9 w-[95px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[15px] text-[16px] text-white tracking-[-1.6px]"
            style={{ fontFamily: "'Waguri', var(--font-sans)" }}
          >
            PART 1
          </span>
          <Typography variant="h2" className="text-black">
            똑똑! 주문이 접수됐어요
          </Typography>
          <Typography variant="sb4" className="text-gray-07">
            장난감을 만들기 위한 정보를 모아볼게요
          </Typography>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <div className="flex-[7]" />
          <img src={characterNotebook} alt="" className="h-[280px] w-[280px] object-contain" />
          <div className="flex-[3]" />
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10">
        <button
          type="button"
          onClick={onNext}
          className="bg-main h-[54px] w-full rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h2" as="span">
            장난감 만들러 가기
          </Typography>
        </button>
      </div>
    </div>
  );
}

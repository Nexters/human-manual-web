import { AnimatePresence, motion } from "framer-motion";
import Typography from "@/components/shared/Typography";
import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import deliveryBunnyGif from "@/assets/gif/delivery-bunny.gif";

type DeliveryStepProps = {
  phase: "loading" | "done";
  onConfirm: () => void;
};

export default function DeliveryStep({ phase, onConfirm }: DeliveryStepProps) {
  return (
    <div className="relative min-h-dvh bg-gray-00">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center pt-[163px]"
        >
          <Typography variant="h1" className="text-black">
            {phase === "loading" ? "배송중 ...." : "배송 완료!"}
          </Typography>
          <Typography variant="sb4" className="mt-[10px] text-gray-07">
            {phase === "loading" ? "택배원이 장난감을 배송하고 있어요" : "토키가 장난감을 배송했어요."}
          </Typography>
          <img
            src={deliveryBunnyGif}
            alt=""
            className="mt-[68px] h-[280px] w-[200px] object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {phase === "done" && (
        <div className="fixed bottom-8 left-1/2 w-full max-w-[440px] -translate-x-1/2 px-5">
          <QuestionCtaButton onClick={onConfirm}>택배 확인하기</QuestionCtaButton>
        </div>
      )}
    </div>
  );
}

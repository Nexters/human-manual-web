import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/shared/Button";
import Typography from "@/components/shared/Typography";
import logo from "@/assets/img/logo.png";
import splashBunny from "@/assets/img/splash-bunny.png";

type SplashScreenProps = {
  phase: "logo" | "cta";
  onStart: () => void;
  onCheckCompatibility: () => void;
};

export default function SplashScreen({ phase, onStart, onCheckCompatibility }: SplashScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {phase === "logo" ? (
        <motion.div
          key="splash-logo"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex h-full min-h-dvh flex-col bg-white"
        >
          <SplashHeader />
          <img src={splashBunny} alt="" className="fixed bottom-0 w-[340px]" />
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
            <Button onClick={onStart}>테스트 시작하기</Button>
            <Button variant="outline" onClick={onCheckCompatibility}>
              친구와의 케미보기
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SplashHeader() {
  return (
    <div className="flex flex-col items-center gap-2 pt-[77px] z-10">
      <img src={logo} alt="Pakit" className="w-[243px]" />
      <Typography variant="sb2" className="text-gray-07">
        나를 닮은 장난감을 만나다
      </Typography>
    </div>
  );
}

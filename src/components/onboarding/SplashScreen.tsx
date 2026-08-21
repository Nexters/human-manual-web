import { motion } from "framer-motion";
import Button from "@/components/shared/Button";
import Typography from "@/components/shared/Typography";
import logo from "@/assets/img/logo.png";
import splashBlocks from "@/assets/img/splash-blocks.png";

type SplashScreenProps = {
  onStart: () => void;
  onCheckCompatibility: () => void;
  onOpenMyResult: () => void;
};

export default function SplashScreen({
  onStart,
  onCheckCompatibility,
  onOpenMyResult,
}: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex h-full min-h-dvh flex-col bg-white"
    >
      <SplashHeader />
      <img src={splashBlocks} alt="" className="mx-auto mt-10 w-[272px]" />
      <div className="mt-auto flex flex-col gap-3 px-5 pb-10">
        <Button onClick={onStart}>테스트 시작하기</Button>
        <Button variant="outline" onClick={onCheckCompatibility}>
          친구와의 케미보기
        </Button>
        {/* 결과 코드가 결과지에 닿는 유일한 열쇠라, 코드를 들고 온 사람에게 입구를 열어둔다. */}
        <button type="button" onClick={onOpenMyResult} className="pt-1 pb-1">
          <Typography variant="me3" className="text-gray-05 underline underline-offset-[3px]">
            이미 테스트를 했다면?
          </Typography>
        </button>
      </div>
    </motion.div>
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

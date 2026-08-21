import { motion } from "framer-motion";
import Button from "@/components/shared/Button";
import Typography from "@/components/shared/Typography";
import logo from "@/assets/img/logo.png";
import splashBlocks from "@/assets/img/splash-blocks.png";

type SplashScreenProps = {
  /** 누적 참여자 수. 없어도 화면이 성립하는 값이라 못 받으면 뱃지를 그리지 않는다. */
  participantCount?: number;
  onStart: () => void;
  onCheckCompatibility: () => void;
  onOpenMyResult: () => void;
};

export default function SplashScreen({
  participantCount,
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
      <SplashHeader participantCount={participantCount} />
      {/* 참여자 뱃지가 붙으면 헤더가 한 줄 길어지므로 일러스트를 그만큼 끌어올린다. */}
      <img
        src={splashBlocks}
        alt=""
        className={
          participantCount === undefined ? "mx-auto mt-10 w-[272px]" : "mx-auto mt-6 w-[272px]"
        }
      />
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

function SplashHeader({ participantCount }: { participantCount?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-[77px] z-10">
      <img src={logo} alt="Pakit" className="w-[243px]" />
      <Typography variant="sb2" className="text-gray-07">
        나를 닮은 장난감을 만나다
      </Typography>
      {participantCount !== undefined && (
        <div className="bg-gray-01 mt-2 flex items-center gap-[6px] rounded-full px-[14px] py-[7px]">
          <span className="bg-sub-4 size-[6px] rounded-full" />
          <Typography variant="me3" className="text-gray-06 tabular-nums">
            {participantCount.toLocaleString("ko-KR")}명이 함께했어요
          </Typography>
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";
import { cn } from "@/lib/cn";

type MatchupProfileCardProps = {
  nickname: ReactNode;
  image: string;
  imageAlt: string;
  /** 이 사람의 결과 코드. 화면에는 안 보이고 복사와 스크린리더 라벨에만 쓴다. */
  resultCode: string;
  onViewResult: () => void;
  onCopyCode: () => void;
  className?: string;
};

export default function MatchupProfileCard({
  nickname,
  image,
  imageAlt,
  resultCode,
  onViewResult,
  onCopyCode,
  className,
}: MatchupProfileCardProps) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-[10px]", className)}>
      <img
        src={image}
        alt={imageAlt}
        className="mb-[2px] size-[134px] rounded-full bg-white object-contain p-3 shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
      />

      {/* 코드는 화면에 내걸지 않는다. 대부분의 방문에서는 필요 없는 값이라, 줄을 하나
          더 쓰는 대신 이름 옆 아이콘으로만 남긴다. 케미 URL 에 두 코드가 다 실려 있어서
          누르는 즉시 복사할 수 있다 — 조회가 필요 없다. */}
      <div className="flex max-w-full items-center gap-[6px]">
        <Typography variant="h2" className="text-gray-07 truncate">
          {nickname}님
        </Typography>
        <button
          type="button"
          onClick={onCopyCode}
          aria-label={`${resultCode} 코드 복사하기`}
          className="text-gray-04 hover:text-gray-06 flex shrink-0 p-[2px] transition-colors"
        >
          <CopyIcon className="size-[15px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onViewResult}
        className="bg-gray-01 hover:bg-gray-02 rounded-full px-4 py-2 transition-colors"
      >
        <Typography variant="me3" as="span" className="text-gray-05 font-semibold">
          자세히 보기
        </Typography>
      </button>
    </div>
  );
}

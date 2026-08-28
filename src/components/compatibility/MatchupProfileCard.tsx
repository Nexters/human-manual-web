import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type MatchupProfileCardProps = {
  nickname: ReactNode;
  /** 이 사람의 장난감 캐릭터명. 닉네임 아래 한 줄. */
  noun: string;
  image: string;
  imageAlt: string;
  onViewResult: () => void;
  className?: string;
};

export default function MatchupProfileCard({
  nickname,
  noun,
  image,
  imageAlt,
  onViewResult,
  className,
}: MatchupProfileCardProps) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-[10px]", className)}>
      <div className="mb-[2px] flex size-[134px] items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
        <img src={image} alt={imageAlt} className="size-[105px] object-contain" />
      </div>

      <div className="flex flex-col items-center">
        <Typography variant="h2" className="text-gray-09 max-w-full truncate">
          {nickname}님
        </Typography>
        <Typography variant="sb4" className="text-gray-07">
          {noun}
        </Typography>
      </div>

      <button
        type="button"
        onClick={onViewResult}
        className="border-main-light text-main flex h-[34px] items-center rounded-[50px] border bg-white px-5 transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Typography variant="me2" as="span">
          결과지 보기
        </Typography>
      </button>
    </div>
  );
}

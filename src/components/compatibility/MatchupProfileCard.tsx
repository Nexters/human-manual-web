import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type MatchupProfileCardProps = {
  nickname: ReactNode;
  image: string;
  imageAlt: string;
  onViewResult: () => void;
  className?: string;
};

export default function MatchupProfileCard({
  nickname,
  image,
  imageAlt,
  onViewResult,
  className,
}: MatchupProfileCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <img
        src={image}
        alt={imageAlt}
        className="size-[134px] rounded-full bg-white object-contain p-3 shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
      />
      <Typography variant="h2" className="text-gray-07">
        {nickname}님
      </Typography>
      <button
        type="button"
        onClick={onViewResult}
        className="bg-gray-01 rounded-full px-4 py-2 transition-colors hover:bg-gray-02"
      >
        <Typography variant="me3" as="span" className="text-gray-05 font-semibold">
          자세히 보기
        </Typography>
      </button>
    </div>
  );
}

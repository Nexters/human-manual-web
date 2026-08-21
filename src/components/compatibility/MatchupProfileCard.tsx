import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type MatchupProfileCardProps = {
  name: ReactNode;
  image: string;
  imageAlt: string;
  className?: string;
};

export default function MatchupProfileCard({
  name,
  image,
  imageAlt,
  className,
}: MatchupProfileCardProps) {
  return (
    <div
      className={cn(
        "flex w-[171px] flex-col items-center gap-6 rounded-[100px] bg-white pt-9 pb-10 shadow-[0_4px_15px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <Typography variant="h1" className="text-gray-07 text-center">
        {name}
      </Typography>
      <img src={image} alt={imageAlt} className="size-[102px] object-contain" />
    </div>
  );
}

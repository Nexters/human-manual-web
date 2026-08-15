import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type MatchupProfileCardProps = {
  variant?: "me" | "friend";
  role: ReactNode;
  name: ReactNode;
  image: string;
  imageAlt: string;
  className?: string;
};

export default function MatchupProfileCard({
  variant = "me",
  role,
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
      <div className="flex flex-col items-center gap-1">
        <Typography variant="sb3" className={cn(variant === "me" ? "text-sub-4" : "text-gray-06")}>
          {role}
        </Typography>
        <Typography variant="h1" className="text-gray-07 text-center">
          {name}
        </Typography>
      </div>
      <img src={image} alt={imageAlt} className="size-[102px] object-contain" />
    </div>
  );
}

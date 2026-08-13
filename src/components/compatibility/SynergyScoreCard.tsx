import type { ReactNode } from "react";
import Chip from "@/components/shared/Chip";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type SynergyScoreCardProps = {
  score: number;
  label: ReactNode;
  description: ReactNode;
  tags: string[];
  className?: string;
};

const SIZE = 96;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SynergyScoreCard({
  score,
  label,
  description,
  tags,
  className,
}: SynergyScoreCardProps) {
  const offset = CIRCUMFERENCE * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <div className={cn("flex flex-col gap-4 rounded-[10px] bg-white p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="relative size-24 shrink-0">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 size-full">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-main)"
              strokeOpacity={0.15}
              strokeWidth={STROKE_WIDTH}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-main)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="text-main absolute inset-0 flex items-center justify-center text-[31px] font-semibold tracking-[-1.2px]">
            {score}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="sb3" className="text-main">
            {label}
          </Typography>
          <Typography variant="me3" className="text-gray-07">
            {description}
          </Typography>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} className="bg-sub-5 text-sub-4">
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  );
}

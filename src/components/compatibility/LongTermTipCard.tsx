import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type LongTermTipCardProps = {
  title: ReactNode;
  description: ReactNode;
  className?: string;
};

export default function LongTermTipCard({ title, description, className }: LongTermTipCardProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="bg-sub-4 w-1.5 shrink-0 rounded-full" />
      <div className="flex flex-col gap-2 py-1">
        <Typography variant="sb4" className="text-gray-09">
          {title}
        </Typography>
        <Typography variant="me3" className="text-gray-07">
          {description}
        </Typography>
      </div>
    </div>
  );
}

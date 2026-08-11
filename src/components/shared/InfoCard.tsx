import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type InfoCardProps = {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  className?: string;
};

export default function InfoCard({ icon, title, description, className }: InfoCardProps) {
  return (
    <div className={cn("flex items-center gap-4 rounded-[10px] bg-white p-4", className)}>
      <span className="flex size-16 shrink-0 items-center justify-center">{icon}</span>
      <div className="flex flex-col gap-1">
        <Typography variant="sb4">{title}</Typography>
        <Typography variant="me3" className="text-gray-07">
          {description}
        </Typography>
      </div>
    </div>
  );
}

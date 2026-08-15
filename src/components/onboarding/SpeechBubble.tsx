import type { ReactNode } from "react";
import Chip from "@/components/shared/Chip";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type SpeechBubbleProps = {
  speaker?: string;
  message: ReactNode;
  className?: string;
};

export default function SpeechBubble({ speaker = "토키", message, className }: SpeechBubbleProps) {
  return (
    <div className={cn("relative", className)}>
      <Chip className="bg-point absolute top-0 left-5 -translate-y-1/2 text-white">{speaker}</Chip>
      <div className="bg-gray-00 rounded-[15px] px-5 pt-7 pb-5">
        <Typography
          variant="sb3"
          as="div"
          className="text-gray-08 flex min-h-[54px] items-center justify-center text-center break-keep"
        >
          <div>{message}</div>
        </Typography>
      </div>
    </div>
  );
}

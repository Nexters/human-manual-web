import type { ReactNode } from "react";
import Chip from "@/components/shared/Chip";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type SpeechBubbleProps = {
  speaker?: string;
  message: ReactNode;
  chipAlign?: "left" | "center";
  className?: string;
};

export default function SpeechBubble({
  speaker = "토키",
  message,
  chipAlign = "left",
  className,
}: SpeechBubbleProps) {
  return (
    <div className={cn("relative", className)}>
      <Chip
        className={cn(
          "bg-point absolute top-0 -translate-y-1/2 text-white",
          chipAlign === "center" ? "left-1/2 -translate-x-1/2" : "left-5",
        )}
      >
        {speaker}
      </Chip>
      <div className="bg-gray-00 rounded-[15px] px-[30px] pt-7 pb-5">
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

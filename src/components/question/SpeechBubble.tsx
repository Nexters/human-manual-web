import type { ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type SpeechBubbleProps = {
  children: ReactNode;
  className?: string;
};

const SpeechBubble = ({ children, className }: SpeechBubbleProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="bg-gray-01 flex h-[34px] items-center rounded-[21.5px] px-5">
        <Typography variant="me2" as="p" className="text-center whitespace-nowrap text-black">
          {children}
        </Typography>
      </div>
      <svg
        viewBox="0 0 14.3983 13"
        className="text-gray-01 absolute -bottom-[8px] left-1/2 w-[14px] -translate-x-1/2 rotate-180"
        fill="none"
        aria-hidden
      >
        <path
          d="M5.46708 1C6.23688 -0.333332 8.16139 -0.333334 8.93119 0.999999L14.1273 10C14.8971 11.3333 13.9349 13 12.3953 13H2.00299C0.463385 13 -0.498868 11.3333 0.270933 10L5.46708 1Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default SpeechBubble;

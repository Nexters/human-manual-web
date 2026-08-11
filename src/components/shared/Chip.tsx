import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ChipProps = ComponentPropsWithoutRef<"span">;

export default function Chip({ className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "bg-gray-00 text-gray-07 inline-flex items-center justify-center rounded-full px-4 py-2",
        "text-[16px] leading-[1.5] font-semibold tracking-[-0.64px]",
        className,
      )}
      {...props}
    />
  );
}

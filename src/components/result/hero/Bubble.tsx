import type { ComponentPropsWithoutRef } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type BubbleProps = ComponentPropsWithoutRef<"span">;

export default function HeroTag({ className, ...props }: BubbleProps) {
  return (
    <Typography
      as="span"
      variant="sb4"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full",
        "bg-white/70 px-4 py-2.5 text-gray-07",
        className,
      )}
      {...props}
    />
  );
}

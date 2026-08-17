import type { ComponentPropsWithoutRef } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type ChipProps = ComponentPropsWithoutRef<"span"> & {
  variant?: Parameters<typeof Typography>[0]["variant"];
};

export default function Chip({ className, variant = "sb4", ...props }: ChipProps) {
  return (
    <Typography
      as="span"
      variant={variant}
      className={cn(
        "bg-gray-00 text-gray-07 inline-flex items-center justify-center rounded-full px-4 py-2",
        className,
      )}
      {...props}
    />
  );
}

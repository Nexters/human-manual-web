import type { ButtonHTMLAttributes } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "solid" | "outline" | "point";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ variant = "solid", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3.5",
        "transition-opacity hover:opacity-90 active:opacity-80",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "solid" && "bg-main text-white",
        variant === "outline" && "border-main text-main border bg-white",
        variant === "point" && "bg-point text-white",
        className,
      )}
      {...props}
    >
      <Typography variant="sb3" as="span">
        {children}
      </Typography>
    </button>
  );
}

import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "solid" | "outline" | "point" | "ghost";
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export default function Button({ variant = "solid", className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3.5",
        "transition-opacity hover:opacity-90",
        "disabled:cursor-not-allowed",
        variant === "solid" && "bg-main disabled:bg-gray-03 text-white",
        variant === "outline" && "border-main text-main border bg-white disabled:opacity-40",
        variant === "point" && "bg-point text-white disabled:opacity-40",
        variant === "ghost" && "bg-gray-01 text-gray-05 disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <Typography variant="sb3" as="span">
        {children}
      </Typography>
    </motion.button>
  );
}

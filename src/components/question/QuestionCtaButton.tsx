import type { ButtonHTMLAttributes } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type QuestionCtaButtonProps = {
  tone?: "main" | "point" | "gray";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const QuestionCtaButton = ({
  tone = "main",
  className,
  children,
  disabled,
  ...props
}: QuestionCtaButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "h-[54px] w-full rounded-[10px] text-white transition-colors",
        disabled
          ? "bg-gray-03 cursor-not-allowed"
          : cn(
              "active:opacity-90",
              tone === "point" ? "bg-sub-4" : tone === "gray" ? "bg-gray-03" : "bg-main",
            ),
        className,
      )}
      {...props}
    >
      <Typography variant="h2" as="span">
        {children}
      </Typography>
    </button>
  );
};

export default QuestionCtaButton;

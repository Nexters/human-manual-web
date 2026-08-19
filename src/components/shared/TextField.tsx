import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ className, ...props }: TextFieldProps) {
  return (
    <input
      className={cn(
        "border-gray-03 text-gray-09 caret-transparent h-[54px] w-full rounded-[10px] border bg-white px-5",
        "text-[18px] leading-[1.5] font-bold tracking-[-0.72px]",
        "placeholder:text-gray-06 placeholder:font-medium",
        "focus:border-main focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

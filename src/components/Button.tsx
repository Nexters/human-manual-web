import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: ButtonProps) {
  return (
    // 버튼 컴포넌트 색상/상태는 Figma에 아직 확정되지 않아 Main 컬러로 임시 구성함
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-main px-5 py-3.5",
        "text-[16px] leading-[1.5] tracking-[-0.64px] font-semibold text-white",
        "transition-opacity hover:opacity-90 active:opacity-80",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

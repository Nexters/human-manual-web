import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

export default function ChevronLeftIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 7" fill="none" className={cn("-rotate-90", className)} {...props}>
      <path
        d="M1 6L6 1L11 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

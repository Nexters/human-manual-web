import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

export default function IconInfo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn("size-5", className)} {...props}>
      <path
        d="M10 10L10 13.75M10 7.22046V7.1875M2.5 10C2.5 5.85786 5.85787 2.5 10 2.5C14.1421 2.5 17.5 5.85787 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

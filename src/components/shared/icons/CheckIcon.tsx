import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

const CheckIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 11.6 9.2" fill="none" className={cn(className)} {...props}>
      <path
        d="M10.6 1L3.44048 8.2L1 5.74572"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;

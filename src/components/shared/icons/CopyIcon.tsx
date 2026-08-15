import type { SVGProps } from "react";

export default function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5 6.33333H3C1.89543 6.33333 1 7.22876 1 8.33333C1 9.4379 1 13.8954 1 15C1 16.1046 1.89543 17 3 17C3 17 8.5621 17 9.66667 17C10.7712 17 11.6667 16.1046 11.6667 15V12.5M15 1L8.33333 1C7.22877 1 6.33333 1.89543 6.33333 3C6.33333 4.10457 6.33333 8.5621 6.33333 9.66667C6.33333 10.7712 7.22876 11.6667 8.33333 11.6667C8.33333 11.6667 13.8954 11.6667 15 11.6667C16.1046 11.6667 17 10.7712 17 9.66667V3C17 1.89543 16.1046 1 15 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

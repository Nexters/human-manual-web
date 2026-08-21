import type { SVGProps } from "react";

export default function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.5 10.5C8.05228 11.2364 8.9 11.6667 9.8 11.6667C10.5 11.6667 11.2 11.4 11.7333 10.8667L14.8667 7.73333C15.9333 6.66667 15.9333 4.93333 14.8667 3.86667C13.8 2.8 12.0667 2.8 11 3.86667L9.93333 4.93333M10.5 7.5C9.94772 6.76364 9.1 6.33333 8.2 6.33333C7.5 6.33333 6.8 6.6 6.26667 7.13333L3.13333 10.2667C2.06667 11.3333 2.06667 13.0667 3.13333 14.1333C4.2 15.2 5.93333 15.2 7 14.1333L8.06667 13.0667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

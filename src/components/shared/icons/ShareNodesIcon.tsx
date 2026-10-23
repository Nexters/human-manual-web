import type { SVGProps } from "react";

export default function ShareNodesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="m6 12 12-7M6 12l12 7" stroke="currentColor" strokeWidth="2" />
      <circle cx="5" cy="12" r="3.5" fill="currentColor" />
      <circle cx="19" cy="4" r="3.5" fill="currentColor" />
      <circle cx="19" cy="20" r="3.5" fill="currentColor" />
    </svg>
  );
}

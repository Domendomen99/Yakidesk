import type { SVGProps } from 'react';

export function DeskStandardShortIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
       <rect x="4" y="7" width="16" height="10" rx="2" />
    </svg>
  );
}

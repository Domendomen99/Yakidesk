import type { SVGProps } from 'react';

export function DeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 13V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6" />
      <path d="M2 13h20" />
      <path d="M12 21v-8" />
      <path d="M7 21v-8" />
      <path d="M17 21v-8" />
    </svg>
  );
}

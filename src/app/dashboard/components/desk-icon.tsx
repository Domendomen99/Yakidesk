import type { SVGProps } from 'react';

export function DeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 18h-2" />
      <path d="M2 18h2" />
      <path d="M12 18h-2" />
      <path d="M20 6v12" />
      <path d="M4 6v12" />
      <path d="M12 6v12" />
      <path d="M2 6h20" />
    </svg>
  );
}

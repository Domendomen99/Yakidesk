import type { SVGProps } from 'react';

export function DeskCornerIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 7v10a2 2 0 0 0 2 2h12" />
      <path d="M12 7h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

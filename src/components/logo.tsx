import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5 9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2.5 12 9.5 9.5 0 0 1 12 2.5z" />
      <path d="M12 2.5V21.5" />
      <path d="M2.5 12H21.5" />
      <path d="M4.75 4.75L19.25 19.25" />
      <path d="M4.75 19.25L19.25 4.75" />
    </svg>
  );
}

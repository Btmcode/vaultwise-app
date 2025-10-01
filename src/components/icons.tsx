
import type { SVGProps } from "react";

export function VaultWiseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function GoldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
        <circle cx="24" cy="24" r="24" fill="#FFD700" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#B8860B" opacity="0.75">$</text>
    </svg>
  );
}

export function SilverIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#C0C0C0" />
      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#696969" opacity="0.75">$</text>
    </svg>
  );
}

export function UsdTryIcon(props: SVGProps<SVGSVGElement>) {
  return(
    <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="usClip">
          <circle cx="16" cy="24" r="16" />
        </clipPath>
        <clipPath id="trClip">
          <circle cx="32" cy="24" r="16" />
        </clipPath>
      </defs>
      
      <g>
        {/* US Flag */}
        <g clipPath="url(#usClip)">
          <rect x="0" y="8" width="32" height="32" fill="#B22234" />
          <path d="M0,12.5H32 M0,21.5H32 M0,30.5H32 M0,39.5H32" stroke="#FFFFFF" strokeWidth="4" />
          <rect x="0" y="8" width="16" height="18" fill="#3C3B6E" />
        </g>
        
        {/* TR Flag */}
        <g clipPath="url(#trClip)">
          <rect x="16" y="8" width="32" height="32" fill="#E30A17" />
          <circle cx="32" cy="24" r="7" fill="#FFFFFF" />
          <circle cx="34" cy="24" r="5.5" fill="#E30A17" />
          <path d="M39 24 l-4.5 -2 l1.5 4.5 v-5 l-1.5 4.5" fill="#FFFFFF" transform="rotate(15, 39, 24)" />
        </g>
      </g>
    </svg>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export const BankIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 21 18 0" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M12 21V7" />
        <path d="M10 12h4" />
        <path d="M21 10h-2.5" />
        <path d="M5.5 10H3" />
    </svg>
);

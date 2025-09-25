
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

export function BtcIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#F7931A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.183 13.003h-6.937v5.934h-4.322v3.74h4.322v6.86h-4.322v3.74h4.322v5.933h6.937v-5.933h2.053c.27 0 .53-.03.78-.08a5.55 5.55 0 004.53-5.59c0-2.82-2.1-5.18-4.87-5.5v-.05c2.1-.5 3.6-2.4 3.6-4.66 0-2.65-2.15-4.8-4.8-4.8h-1.3zM21.986 28.53v-5.414h3.64c1.4 0 2.55 1.14 2.55 2.55v.314c0 1.41-1.15 2.55-2.55 2.55h-3.64zm0-9.155V16.74h3.1c1.24 0 2.25 1 2.25 2.24v.26c0 1.24-1.01 2.25-2.25 2.25h-3.1z"
        fill="#fff"
      />
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
      <defs>
        <radialGradient id="gold-gradient-coin" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FFFDE4" />
          <stop offset="60%" stopColor="#FFD700" />
          <stop offset="95%" stopColor="#FDB813" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#gold-gradient-coin)" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
}

export function GoldBarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
        {...props}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg" 
        fill="none">
        <defs>
            <linearGradient id="gold-bar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDF00" />
                <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
        </defs>
        <path 
            d="M6 16 L10 12 L38 12 L42 16 L42 36 L38 40 L10 40 L6 36 Z" 
            fill="url(#gold-bar-gradient)" 
            stroke="#A07000" 
            strokeWidth="1"
        />
        <path 
            d="M10 12 L38 12 L42 16 L38 20 L10 20 L6 16 Z" 
            fill="#FFE766"
            opacity="0.5"
        />
        <text x="24" y="30" textAnchor="middle" fontSize="8" fill="#A07000" fontWeight="bold">999.9</text>
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
      <defs>
         <radialGradient id="silver-gradient-coin" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E0E0E0" />
          <stop offset="95%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#8E8E8E" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#silver-gradient-coin)" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#8E8E8E" strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
}

export function PaxgIcon(props: SVGProps<SVGSVGElement>) {
  return (
     <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#F0B90B" />
      <path d="M24 35c6.075 0 11-4.925 11-11S30.075 13 24 13 13 17.925 13 24s4.925 11 11 11z" fill="#fff" />
      <path d="M24 38.682c8.113 0 14.682-6.57 14.682-14.682S32.113 9.318 24 9.318 9.318 15.887 9.318 24 15.887 38.682 24 38.682zM24 34c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z" fill="#F0B90B" />
    </svg>
  );
}


export function XautIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#F0B90B" />
      <path d="M24.23 35.83c-6.23 0-11.28-5.06-11.28-11.28 0-6.23 5.05-11.28 11.28-11.28s11.28 5.05 11.28 11.28c0 6.22-5.05 11.28-11.28 11.28zm0-20.5c-5.09 0-9.22 4.13-9.22 9.22s4.13 9.22 9.22 9.22 9.22-4.13 9.22-9.22-9.22-4.13-9.22-9.22z" fillOpacity=".4" fill="#fff" />
      <path d="M16.92 13.33h14.62v3.7H16.92v-3.7zm7.3 22.5V17.03h-3.7v18.8h3.7z" fill="#fff" />
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
    

    

    

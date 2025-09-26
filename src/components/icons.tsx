
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
            <radialGradient id="gold-coin-gradient-premium" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#FFF7B2" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="95%" stopColor="#B8860B" />
                <stop offset="100%" stopColor="#A4770A" />
            </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#gold-coin-gradient-premium)" />
        <circle cx="24" cy="24" r="22" fill="none" stroke="#B8860B" strokeWidth="1" strokeOpacity="0.5" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#B8860B" opacity="0.75">$</text>
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
            <linearGradient id="gold-bar-gradient-premium" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFAA00" />
                <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <filter id="gold-bar-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
                <feOffset in="blur" dx="1" dy="2" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#gold-bar-shadow)">
            <path 
                d="M4 14 L12 10 L44 10 L44 34 L36 38 L4 38 Z" 
                fill="url(#gold-bar-gradient-premium)" 
                stroke="#A07000" 
                strokeWidth="0.5"
            />
            <path 
                d="M12 10 L44 10 L36 18 L4 18 L12 14 Z"
                fill="#FFEB99"
                opacity="0.6"
            />
            <text x="24" y="28" textAnchor="middle" fontSize="8" fill="#A07000" fontWeight="bold">999.9</text>
        </g>
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
         <radialGradient id="silver-coin-gradient-premium" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="60%" stopColor="#C0C0C0" />
            <stop offset="95%" stopColor="#A9A9A9" />
            <stop offset="100%" stopColor="#808080" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#silver-coin-gradient-premium)" />
      <circle cx="24" cy="24" r="22" fill="none" stroke="#808080" strokeWidth="1" strokeOpacity="0.6" />
      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#696969" opacity="0.75">$</text>
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
        <defs>
            <radialGradient id="paxg-gradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#F8E087" />
                <stop offset="100%" stopColor="#D4A12A" />
            </radialGradient>
            <filter id="paxg-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#paxg-shadow)">
            <circle cx="24" cy="24" r="22" fill="url(#paxg-gradient)" />
            <path d="M24 35c6.075 0 11-4.925 11-11S30.075 13 24 13 13 17.925 13 24s4.925 11 11 11z" fill="#fff" fillOpacity="0.9" />
            <path d="M24 38c7.732 0 14-6.268 14-14S31.732 10 24 10 10 16.268 10 24s6.268 14 14 14zm0-34C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" fill="none" />
            <path d="M24 34c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z" fill="#D4A12A" />
        </g>
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
        <defs>
            <linearGradient id="xaut-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9D423" />
                <stop offset="100%" stopColor="#E6A914" />
            </linearGradient>
            <filter id="xaut-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#xaut-shadow)">
            <circle cx="24" cy="24" r="22" fill="url(#xaut-gradient)" />
            <path d="M24.23 35.83c-6.23 0-11.28-5.06-11.28-11.28 0-6.23 5.05-11.28 11.28-11.28s11.28 5.05 11.28 11.28c0 6.22-5.05 11.28-11.28 11.28zm0-20.5c-5.09 0-9.22 4.13-9.22 9.22s4.13 9.22 9.22 9.22 9.22-4.13 9.22-9.22-9.22-4.13-9.22-9.22z" fillOpacity=".2" fill="#000" />
            <path d="M16.92 13.33h14.62v3.7H16.92v-3.7zm7.3 22.5V17.03h-3.7v18.8h3.7z" fill="#fff" />
        </g>
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
    

    

    




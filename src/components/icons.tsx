
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
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#F7931A" />
      <path
        d="M33.433 24.322a4.673 4.673 0 0 0 1.98-3.738c0-2.58-2.03-4.66-4.545-4.66h-7.227v17.062h8.04c2.618 0 4.743-2.053 4.743-4.59 0-2.12-1.42-3.92-3.418-4.444zm-9.255-6.392h5.114c1.378 0 2.5 1.13 2.5 2.52 0 1.39-1.122 2.52-2.5 2.52h-5.114v-5.04zm5.53 10.662h-5.53v-5.582h5.53c1.54 0 2.783 1.257 2.783 2.81 0 1.55-1.243 2.772-2.783 2.772z"
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
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000" fillOpacity="0.6">
        GOLD
      </text>
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
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000" fillOpacity="0.6">
        SILVER
      </text>
    </svg>
  );
}

export function PaxgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#1A1A1A" />
      <path d="M24.0001 34.909C29.9991 34.909 34.9091 29.999 34.9091 24C34.9091 18.001 29.9991 13.091 24.0001 13.091C18.0011 13.091 13.0911 18.001 13.0911 24C13.0911 29.999 18.0011 34.909 24.0001 34.909Z" fill="#F2A900"/>
      <path d="M24 38.6818C32.1127 38.6818 38.6818 32.1127 38.6818 24C38.6818 15.8873 32.1127 9.31818 24 9.31818C15.8873 9.31818 9.31818 15.8873 9.31818 24C9.31818 32.1127 15.8873 38.6818 24 38.6818ZM24 34.0455C29.5455 34.0455 34.0455 29.5455 34.0455 24C34.0455 18.4545 29.5455 13.9545 24 13.9545C18.4545 13.9545 13.9545 18.4545 13.9545 24C13.9545 29.5455 18.4545 34.0455 24 34.0455Z" fill="#D79800"/>
    </svg>
  );
}


export function XautIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="24" cy="24" r="24" fill="#F1A900" />
      <path
        d="M24.23 35.83c-6.23 0-11.28-5.06-11.28-11.28 0-6.23 5.05-11.28 11.28-11.28s11.28 5.05 11.28 11.28c0 6.22-5.05 11.28-11.28 11.28zm0-20.5c-5.09 0-9.22 4.13-9.22 9.22s4.13 9.22 9.22 9.22 9.22-4.13 9.22-9.22-9.22-4.13-9.22-9.22z"
        fillOpacity=".4"
        fill="#fff"
      />
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
    

    
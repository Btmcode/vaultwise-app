
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
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFDF00" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 14C8 12.8954 8.89543 12 10 12H38C39.1046 12 40 12.8954 40 14V34C40 35.1046 39.1046 36 38 36H10C8.89543 36 8 35.1046 8 34V14Z"
        fill="url(#gold-gradient)"
      />
      <path
        d="M14 21H34V27H14V21Z"
        stroke="#DAA520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 14C8 12.8954 8.89543 12 10 12H38C39.1046 12 40 12.8954 40 14V34C40 35.1046 39.1046 36 38 36H10C8.89543 36 8 35.1046 8 34V14Z"
        fill="url(#silver-gradient)"
      />
      <path
        d="M14 21H34V27H14V21Z"
        stroke="#C0C0C0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

    

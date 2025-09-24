
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
      <circle cx="24" cy="24" r="24" fill="#F2A900" />
      <path
        d="m36.91 29.58-6.1-6.1c.32-.48.51-1.06.51-1.68 0-1.76-1.43-3.19-3.18-3.19-1.76 0-3.18 1.43-3.18 3.19s1.42 3.18 3.18 3.18c.62 0 1.2-.19 1.68-.51l6.1 6.1c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41zm-8.73-3.21c0-1.32-1.07-2.39-2.39-2.39-1.32 0-2.39 1.07-2.39 2.39s1.07 2.39 2.39 2.39c1.32 0 2.39-1.07 2.39-2.39zm-13.8-13.99h5.69l3.22 8.44h.1L26.6 12.38h5.27v20.9h-4.32v-16.1h-.1l-4.14 10.9h-2.5l-4.13-10.9h-.1v16.1H14.38V12.38z"
        fill="#fff"
      />
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
    <svg 
      {...props}
      viewBox="0 0 48 48" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip0_105_2">
          <rect width="48" height="48" rx="24" fill="white"/>
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_105_2)">
        <path d="M48 0H0V48H48V0Z" fill="#F0F0F0"/>
        <path d="M0 0H24V48H0V0Z" fill="#D80027"/>
        <path d="M13.3043 27.2174L10 24.6087L6.69565 27.2174L7.82609 23.2174L4.95652 20.7826H9.13043L10 16.6957L10.8696 20.7826H15.0435L12.1739 23.2174L13.3043 27.2174Z" fill="#F0F0F0"/>
        <path d="M11.5333 25.5333C12.9233 26.3333 14.52 26.6667 16 26.6667C19.68 26.6667 22.6667 23.68 22.6667 20C22.6667 16.32 19.68 13.3333 16 13.3333C14.52 13.3333 12.9233 13.6667 11.5333 14.4667C12.56 13.04 14.16 12 16 12C20.4183 12 24 15.5817 24 20C24 24.4183 20.4183 28 16 28C14.16 28 12.56 27 11.5333 25.5333Z" fill="#F0F0F0"/>
        <path d="M24 0H48V48H24V0Z" fill="#3D58A7"/>
        <path d="M48 27.4286H34.2857V48H30.8571V27.4286H24V24H30.8571V0H34.2857V24H48V27.4286Z" fill="#F0F0F0"/>
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

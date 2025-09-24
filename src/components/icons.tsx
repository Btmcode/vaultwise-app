
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
       <g clipPath="url(#clip0_1_1)">
        <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="white"/>
        <path d="M31.9546 11.2319C33.6823 13.2091 34.6186 15.8239 34.6186 18.6496C34.6186 24.6307 29.8143 29.4349 23.8332 29.4349C19.988 29.4349 16.5912 27.5583 14.614 24.6307L18.9193 22.3781C19.988 24.012 21.7157 25.0805 23.8332 25.0805C27.0945 25.0805 29.8143 22.4658 29.8143 19.1021C29.8143 15.8239 27.1798 13.2091 23.8332 13.2091C22.4208 13.2091 21.0936 13.7226 20.0249 14.5492L18.3825 9.745C20.0249 8.83155 21.889 8.31804 23.8332 8.31804C27.1798 8.31804 30.1506 9.47917 31.9546 11.2319Z" fill="#F2A900" fillOpacity="0.5"/>
        <path d="M38.8398 21.293C40.4823 23.2702 41.4186 25.8849 41.4186 28.7106C41.4186 36.3353 35.4375 42.3164 27.8128 42.3164C22.8443 42.3164 18.539 39.4038 16.3885 35.1855L21.357 32.5707C22.6842 35.0986 25.0564 36.6455 27.8128 36.6455C32.449 36.6455 36.2088 33.1593 36.2088 28.6236C36.2088 24.1748 32.2757 20.6886 27.8128 20.6886C26.1704 20.6886 24.6101 21.2021 23.3681 22.0287L21.5309 17.2245C23.3681 16.311 25.4856 15.7007 27.8128 15.7007C31.7459 15.7007 35.4375 17.6741 37.588 20.6017L38.8398 21.293Z" fill="#F2A900" fillOpacity="0.7"/>
        <path d="M24 38.6818C32.1127 38.6818 38.6818 32.1127 38.6818 24C38.6818 15.8873 32.1127 9.31818 24 9.31818C15.8873 9.31818 9.31818 15.8873 9.31818 24C9.31818 32.1127 15.8873 38.6818 24 38.6818ZM24 34.0455C29.5455 34.0455 34.0455 29.5455 34.0455 24C34.0455 18.4545 29.5455 13.9545 24 13.9545C18.4545 13.9545 13.9545 18.4545 13.9545 24C13.9545 29.5455 18.4545 34.0455 24 34.0455Z" fill="#D79800"/>
      </g>
      <defs>
        <clipPath id="clip0_1_1">
          <rect width="48" height="48" fill="white"/>
        </clipPath>
      </defs>
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
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <clipPath id="clip_USD">
          <path d="M 0 24 a 24 24 0 0 1 48 0 V 48 H 0 Z" />
        </clipPath>
        <clipPath id="clip_TRY">
          <path d="M 0 0 h 48 v 24 a 24 24 0 0 1 -48 0 V 0 Z" />
        </clipPath>
      </defs>
      <g>
        {/* US Flag part */}
        <g clipPath="url(#clip_USD)">
          <rect width="48" height="48" fill="#B22234" />
          <path d="M0,4.5H48 M0,13.5H48 M0,22.5H48 M0,31.5H48 M0,40.5H48" stroke="#FFFFFF" strokeWidth="4" />
          <rect width="24" height="27" fill="#3C3B6E" />
        </g>
        {/* Turkish Flag part */}
        <g clipPath="url(#clip_TRY)">
          <rect width="48" height="48" fill="#E30A17" />
          <circle cx="18" cy="24" r="7" fill="#FFFFFF" />
          <circle cx="20" cy="24" r="5.5" fill="#E30A17" />
          <path d="M27 24 l-4.5 -2 l1.5 4.5 v-5 l-1.5 4.5" fill="#FFFFFF" transform="rotate(15, 27, 24)" />
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

    
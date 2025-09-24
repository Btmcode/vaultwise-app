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
      >
        <g fill="none" fillRule="evenodd">
            <circle fill="#F7931A" cx="24" cy="24" r="24"/>
            <path d="M33.433 24.322a4.673 4.673 0 0 0 1.98-3.738c0-2.58-2.03-4.66-4.545-4.66h-7.227v17.062h8.04c2.618 0 4.743-2.053 4.743-4.59 0-2.12-1.42-3.92-3.418-4.444zm-9.255-6.392h5.114c1.378 0 2.5 1.13 2.5 2.52 0 1.39-1.122 2.52-2.5 2.52h-5.114v-5.04zm5.53 10.662h-5.53v-5.582h5.53c1.54 0 2.783 1.257 2.783 2.81 0 1.55-1.243 2.772-2.783 2.772z" fill="#FFF"/>
        </g>
    </svg>
  );
}

export function GoldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      fill="#FFD700"
    >
        <path d="M14 4H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM2 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H2z" />
        <path d="M1 8h14v1H1z" />
    </svg>
  );
}

export function SilverIcon(props: SVGProps<SVGSVGElement>) {
  return (
     <svg
      {...props}
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      fill="#C0C0C0"
    >
        <path d="M14 4H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM2 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H2z" />
        <path d="M1 8h14v1H1z" />
    </svg>
  );
}

export function PaxgIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
          {...props}
          viewBox="0 0 48 48" 
          xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <circle fill="#F2A900" cx="24" cy="24" r="24"/>
                <path d="m36.91 29.58-6.1-6.1c.32-.48.51-1.06.51-1.68 0-1.76-1.43-3.19-3.18-3.19-1.76 0-3.18 1.43-3.18 3.19s1.42 3.18 3.18 3.18c.62 0 1.2-.19 1.68-.51l6.1 6.1c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41zm-8.73-3.21c0-1.32-1.07-2.39-2.39-2.39-1.32 0-2.39 1.07-2.39 2.39s1.07 2.39 2.39 2.39c1.32 0 2.39-1.07 2.39-2.39zm-13.8-13.99h5.69l3.22 8.44h.1L26.6 12.38h5.27v20.9h-4.32v-16.1h-.1l-4.14 10.9h-2.5l-4.13-10.9h-.1v16.1H14.38V12.38z" fill="#FFF"/>
            </g>
        </svg>
    )
}

export function XautIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            {...props}
            viewBox="0 0 48 48" 
            xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <circle fill="#F1A900" cx="24" cy="24" r="24"/>
                <path d="M24.23 35.83c-6.23 0-11.28-5.06-11.28-11.28 0-6.23 5.05-11.28 11.28-11.28s11.28 5.05 11.28 11.28c0 6.22-5.05 11.28-11.28 11.28zm0-20.5c-5.09 0-9.22 4.13-9.22 9.22s4.13 9.22 9.22 9.22 9.22-4.13 9_22-9.22-9.22-9.22-9.22z" fill-opacity=".4" fill="#FFF"/>
                <path d="M16.92 13.33h14.62v3.7H16.92v-3.7zm7.3 22.5V17.03h-3.7v18.8h3.7z" fill="#FFF"/>
            </g>
        </svg>
    )
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    )
}
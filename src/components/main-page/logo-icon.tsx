import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

export const LogoIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    width={44}
    height={22}
    viewBox="0 0 44 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.1065 22L14.8142 18.3058H7.18645L5.76807 22H0L8.06899 0H14.0262L21.9376 22H16.1065ZM8.69938 13.952H13.3643L11.0003 6.82759L8.69938 13.952Z"
      fill="#6159FF"
    />
    <path
      d="M29.8162 0V9.07047L36.4984 0H43.2435L34.8909 10.4228L44 22H36.9396L29.8162 12.4678V22H24.3633V0H29.8162Z"
      fill="#6159FF"
    />
  </svg>
)

import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

export const ArrowPremium = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8 0H0V6L8 0Z" fill="#531DAB" />
  </svg>
)

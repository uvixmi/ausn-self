import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

export const FirstStepper = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    width="56"
    height="8"
    viewBox="0 0 56 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="24" height="8" rx="4" fill="#6159FF" />
    <rect x="32" width="8" height="8" rx="4" fill="#D1D1D1" />
    <rect x="48" width="8" height="8" rx="4" fill="#D1D1D1" />
  </svg>
)

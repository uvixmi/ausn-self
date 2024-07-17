import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

interface ArrowCounterIconProps
  extends JSX.IntrinsicAttributes,
    SVGProps<SVGSVGElement> {
  className?: string
}

export const ActionCurrencyIcon = ({
  className = "",
  ...props
}: ArrowCounterIconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} arrow-color-icon`}
    {...props}
  >
    <path d="M18.5 19C20.4891 19 22.3968 18.2098 23.8033 16.8033C25.2098 15.3968 26 13.4891 26 11.5C26 9.51088 25.2098 7.60322 23.8033 6.1967C22.3968 4.79018 20.4891 4 18.5 4H11C10.7348 4 10.4804 4.10536 10.2929 4.29289C10.1054 4.48043 10 4.73478 10 5V17H7C6.73478 17 6.48043 17.1054 6.29289 17.2929C6.10536 17.4804 6 17.7348 6 18C6 18.2652 6.10536 18.5196 6.29289 18.7071C6.48043 18.8946 6.73478 19 7 19H10V21H7C6.73478 21 6.48043 21.1054 6.29289 21.2929C6.10536 21.4804 6 21.7348 6 22C6 22.2652 6.10536 22.5196 6.29289 22.7071C6.48043 22.8946 6.73478 23 7 23H10V27C10 27.2652 10.1054 27.5196 10.2929 27.7071C10.4804 27.8946 10.7348 28 11 28C11.2652 28 11.5196 27.8946 11.7071 27.7071C11.8946 27.5196 12 27.2652 12 27V23H18C18.2652 23 18.5196 22.8946 18.7071 22.7071C18.8946 22.5196 19 22.2652 19 22C19 21.7348 18.8946 21.4804 18.7071 21.2929C18.5196 21.1054 18.2652 21 18 21H12V19H18.5ZM12 6H18.5C19.9587 6 21.3576 6.57946 22.3891 7.61091C23.4205 8.64236 24 10.0413 24 11.5C24 12.9587 23.4205 14.3576 22.3891 15.3891C21.3576 16.4205 19.9587 17 18.5 17H12V6Z" />
  </svg>
)
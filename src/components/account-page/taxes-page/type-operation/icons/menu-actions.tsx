import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

interface ArrowCounterIconProps
  extends JSX.IntrinsicAttributes,
    SVGProps<SVGSVGElement> {
  className?: string
}

export const MenuActionsIcon = ({
  className = "",
  ...props
}: ArrowCounterIconProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} arrow-color-icon`}
    {...props}
  >
    <path d="M11.375 1.75H10.0625V1.3125C10.0625 1.19647 10.0164 1.08519 9.93436 1.00314C9.85231 0.921094 9.74103 0.875 9.625 0.875C9.50897 0.875 9.39769 0.921094 9.31564 1.00314C9.23359 1.08519 9.1875 1.19647 9.1875 1.3125V1.75H4.8125V1.3125C4.8125 1.19647 4.76641 1.08519 4.68436 1.00314C4.60231 0.921094 4.49103 0.875 4.375 0.875C4.25897 0.875 4.14769 0.921094 4.06564 1.00314C3.98359 1.08519 3.9375 1.19647 3.9375 1.3125V1.75H2.625C2.39294 1.75 2.17038 1.84219 2.00628 2.00628C1.84219 2.17038 1.75 2.39294 1.75 2.625V11.375C1.75 11.6071 1.84219 11.8296 2.00628 11.9937C2.17038 12.1578 2.39294 12.25 2.625 12.25H11.375C11.6071 12.25 11.8296 12.1578 11.9937 11.9937C12.1578 11.8296 12.25 11.6071 12.25 11.375V2.625C12.25 2.39294 12.1578 2.17038 11.9937 2.00628C11.8296 1.84219 11.6071 1.75 11.375 1.75ZM3.9375 2.625V3.0625C3.9375 3.17853 3.98359 3.28981 4.06564 3.37186C4.14769 3.45391 4.25897 3.5 4.375 3.5C4.49103 3.5 4.60231 3.45391 4.68436 3.37186C4.76641 3.28981 4.8125 3.17853 4.8125 3.0625V2.625H9.1875V3.0625C9.1875 3.17853 9.23359 3.28981 9.31564 3.37186C9.39769 3.45391 9.50897 3.5 9.625 3.5C9.74103 3.5 9.85231 3.45391 9.93436 3.37186C10.0164 3.28981 10.0625 3.17853 10.0625 3.0625V2.625H11.375V4.375H2.625V2.625H3.9375ZM11.375 11.375H2.625V5.25H11.375V11.375ZM9.27828 6.69047C9.31896 6.7311 9.35123 6.77935 9.37325 6.83246C9.39526 6.88558 9.40659 6.94251 9.40659 7C9.40659 7.05749 9.39526 7.11442 9.37325 7.16754C9.35123 7.22065 9.31896 7.2689 9.27828 7.30953L6.65328 9.93453C6.61265 9.97521 6.5644 10.0075 6.51129 10.0295C6.45817 10.0515 6.40124 10.0628 6.34375 10.0628C6.28626 10.0628 6.22933 10.0515 6.17621 10.0295C6.1231 10.0075 6.07485 9.97521 6.03422 9.93453L4.72172 8.62203C4.63963 8.53994 4.59351 8.4286 4.59351 8.3125C4.59351 8.1964 4.63963 8.08506 4.72172 8.00297C4.80381 7.92088 4.91515 7.87476 5.03125 7.87476C5.14735 7.87476 5.25869 7.92088 5.34078 8.00297L6.34375 9.00648L8.65922 6.69047C8.69985 6.64979 8.7481 6.61752 8.80121 6.59551C8.85433 6.57349 8.91126 6.56216 8.96875 6.56216C9.02624 6.56216 9.08317 6.57349 9.13629 6.59551C9.1894 6.61752 9.23765 6.64979 9.27828 6.69047Z" />
  </svg>
)
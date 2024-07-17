import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

interface ArrowCounterIconProps
  extends JSX.IntrinsicAttributes,
    SVGProps<SVGSVGElement> {
  className?: string
}

export const BellBannerIcon = ({
  className = "",
  ...props
}: ArrowCounterIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.5001 5.55501C17.3529 5.6312 17.1816 5.64585 17.0237 5.59575C16.8657 5.54565 16.7342 5.43489 16.6579 5.28782C16.0613 4.1093 15.1583 3.11321 14.0438 2.40423C13.9744 2.36042 13.9142 2.30336 13.8668 2.23631C13.8194 2.16925 13.7857 2.09352 13.7675 2.01343C13.7494 1.93334 13.7472 1.85046 13.7611 1.76953C13.775 1.68859 13.8047 1.61119 13.8485 1.54173C13.8923 1.47227 13.9494 1.41212 14.0164 1.36472C14.0835 1.31731 14.1592 1.28358 14.2393 1.26544C14.3194 1.24731 14.4023 1.24512 14.4832 1.25902C14.5641 1.27291 14.6415 1.30261 14.711 1.34642C16.0099 2.17809 17.0646 3.33983 17.7672 4.71282C17.8434 4.85995 17.8581 5.0313 17.808 5.18922C17.7579 5.34715 17.6471 5.47871 17.5001 5.55501ZM2.7899 5.62532C2.9044 5.62527 3.01669 5.59377 3.11451 5.53426C3.21233 5.47474 3.29192 5.38949 3.34459 5.28782C3.94115 4.1093 4.84413 3.11321 5.95865 2.40423C6.09893 2.31576 6.19831 2.17518 6.23494 2.01343C6.27156 1.85168 6.24244 1.682 6.15396 1.54173C6.06549 1.40146 5.92491 1.30207 5.76316 1.26544C5.60141 1.22882 5.43174 1.25794 5.29146 1.34642C3.99256 2.17809 2.93785 3.33983 2.23521 4.71282C2.18587 4.80807 2.16187 4.91442 2.16552 5.02163C2.16918 5.12884 2.20037 5.2333 2.25609 5.32497C2.31181 5.41664 2.39019 5.49242 2.48368 5.54502C2.57717 5.59762 2.68263 5.62528 2.7899 5.62532ZM17.329 13.7456C17.4397 13.9355 17.4984 14.1512 17.4991 14.371C17.4999 14.5908 17.4427 14.8069 17.3333 14.9976C17.2238 15.1882 17.0661 15.3466 16.8759 15.4568C16.6857 15.567 16.4699 15.6252 16.2501 15.6253H13.0626C12.9191 16.3318 12.5359 16.9669 11.9777 17.4231C11.4196 17.8792 10.7209 18.1285 10.0001 18.1285C9.27921 18.1285 8.58053 17.8792 8.0224 17.4231C7.46426 16.9669 7.081 16.3318 6.93756 15.6253H3.75006C3.53039 15.6249 3.31471 15.5666 3.12475 15.4562C2.93479 15.3459 2.77726 15.1875 2.66802 14.9969C2.55879 14.8063 2.50171 14.5903 2.50253 14.3706C2.50335 14.151 2.56205 13.9354 2.67271 13.7456C3.37662 12.5308 3.75006 10.8034 3.75006 8.75032C3.75006 7.09272 4.40854 5.50301 5.58064 4.33091C6.75274 3.1588 8.34245 2.50032 10.0001 2.50032C11.6577 2.50032 13.2474 3.1588 14.4195 4.33091C15.5916 5.50301 16.2501 7.09272 16.2501 8.75032C16.2501 10.8027 16.6235 12.53 17.329 13.7456ZM11.7672 15.6253H8.23287C8.36236 15.9905 8.60178 16.3066 8.91823 16.5301C9.23468 16.7537 9.61261 16.8737 10.0001 16.8737C10.3875 16.8737 10.7654 16.7537 11.0819 16.5301C11.3983 16.3066 11.6378 15.9905 11.7672 15.6253ZM16.2501 14.3753C15.4188 12.948 15.0001 11.0558 15.0001 8.75032C15.0001 7.42424 14.4733 6.15247 13.5356 5.21479C12.5979 4.27711 11.3261 3.75032 10.0001 3.75032C8.67397 3.75032 7.4022 4.27711 6.46452 5.21479C5.52684 6.15247 5.00006 7.42424 5.00006 8.75032C5.00006 11.0566 4.57974 12.9488 3.75006 14.3753H16.2501Z"
      fill="#383494"
    />
  </svg>
)
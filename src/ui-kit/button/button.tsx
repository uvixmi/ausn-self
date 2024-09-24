import cn from "classnames"
import { ButtonProps } from "./types"
import styles from "./styles.module.scss"
import { Button } from "antd"
import { useState } from "react"

export const ButtonOne = ({
  id,
  type = "primary",
  size = "medium",
  disabled = false,
  dataTestId = "button",
  children,
  className,
  ref,
  onBlur,
  onFocus,
  onClick,
  onMouseEnter,
  onMouseLeave,

  ...ariaAttributes
}: ButtonProps) => {
  const [isActive, setIsActive] = useState(false)
  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(event)
  }

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event)
  }

  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    onBlur?.(event)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    event.currentTarget.blur()
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    setIsActive(true)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    setIsActive(false)
  }

  const buttonClassnames = cn(
    styles.button,
    styles["default"],
    styles[type],
    { [styles.active]: isActive },
    className
  )

  return (
    <Button
      {...ariaAttributes}
      id={id}
      ref={ref}
      disabled={disabled}
      data-test-id={dataTestId}
      className={buttonClassnames}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </Button>
  )
}

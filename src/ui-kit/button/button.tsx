import cn from "classnames"
import { ButtonProps } from "./types"
import styles from "./styles.module.scss"
import { Button } from "antd"

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
  onTouchEnd,
  ...ariaAttributes
}: ButtonProps) => {
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

  const buttonClassnames = cn(
    styles.button,
    styles["default"],
    styles[type],
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
      onTouchEnd={onTouchEnd}
    >
      {children}
    </Button>
  )
}

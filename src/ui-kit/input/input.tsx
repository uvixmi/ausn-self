import cn from "classnames"
import { ButtonProps } from "./types"
import styles from "./styles.module.scss"
import { Input } from "antd"

export const InputOne = ({
  id,
  type = "primary",
  size = "medium",
  placeholder,
  disabled = false,
  dataTestId = "button",
  children,
  className,
  onBlur,
  onFocus,
  onChange,
  onMouseEnter,
  onMouseLeave,
  ...ariaAttributes
}: ButtonProps) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event)
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLInputElement>) => {
    onMouseEnter?.(event)
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLInputElement>) => {
    onMouseLeave?.(event)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
  }

  const inputClassnames = cn(styles["default"], className)

  return (
    <Input
      {...ariaAttributes}
      id={id}
      disabled={disabled}
      data-test-id={dataTestId}
      className={inputClassnames}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      placeholder={placeholder}
    >
      {children}
    </Input>
  )
}

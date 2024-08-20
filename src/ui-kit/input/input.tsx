import cn from "classnames"
import { ButtonProps } from "./types"
import styles from "./styles.module.scss"
import { Input } from "antd"
import "./styles.scss"

export const InputOne = ({
  id,
  type,
  size = "medium",
  placeholder,
  disabled = false,
  maxLength,
  dataTestId = "button",
  children,
  showCount,
  className,
  autoComplete,
  value,
  status,

  ref,
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
    <div className="default-input-auto">
      <Input
        {...ariaAttributes}
        value={value}
        id={id}
        ref={ref}
        disabled={disabled}
        data-test-id={dataTestId}
        maxLength={maxLength}
        className={inputClassnames}
        autoComplete={autoComplete}
        onBlur={handleBlur}
        onChange={handleChange}
        showCount={showCount}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        placeholder={placeholder}
        type={type}
        status={status}
      >
        {children}
      </Input>
    </div>
  )
}

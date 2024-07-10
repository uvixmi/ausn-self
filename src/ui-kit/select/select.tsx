import cn from "classnames"
import { ButtonProps } from "./types"
import styles from "./styles.module.scss"
import "./styles.scss"
import { ConfigProvider, Select } from "antd"

export const SelectOne = ({
  id,

  disabled = false,
  dataTestId = "select",
  children,
  className,
  placeholder,
  options,
  onChange,
  onClear,
  value,
  mode,
  notFoundContent,
  maxTagCount,
  defaultValue,
  allowClear,
  dropdownRender,
  dropdownStyle,
  onBlur,
  onFocus,
  open,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDropdownVisibleChange,
  ...ariaAttributes
}: ButtonProps) => {
  const selectClassnames = cn("select-custom", styles["default"], className)

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionActiveBg: "#F0F0FF",
            optionPadding: "6px 12px",
            multipleItemBg: "#FFFFFF",
          },
        },
      }}
    >
      <Select
        {...ariaAttributes}
        id={id}
        disabled={disabled}
        data-test-id={dataTestId}
        className={selectClassnames}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        onClear={onClear}
        value={value}
        mode={mode}
        open={open}
        maxTagCount={maxTagCount}
        defaultValue={defaultValue}
        allowClear={allowClear}
        dropdownStyle={{ ...dropdownStyle, padding: 0, borderRadius: 0 }}
        onBlur={onBlur}
        dropdownRender={dropdownRender}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onDropdownVisibleChange={onDropdownVisibleChange}
        notFoundContent={notFoundContent}
        onClick={onClick}
        style={{ borderRadius: "4px" }}
      >
        {children}
      </Select>
    </ConfigProvider>
  )
}

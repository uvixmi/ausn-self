import {
  ReactNode,
  FocusEvent,
  MouseEvent,
  ButtonHTMLAttributes,
  AriaAttributes,
  ChangeEvent,
} from "react"
import { BUTTON_TYPES, BUTTON_SIZES } from "./constants"
import { DefaultOptionType, LabeledValue } from "antd/es/select"

type Values<T> = T[keyof T]
type ButtonSize = Values<typeof BUTTON_SIZES>
export type ButtonType = Values<typeof BUTTON_TYPES>
type ButtonHTMLType = ButtonHTMLAttributes<HTMLButtonElement>["type"]

export type ButtonProps = {
  /**
   * Идентификатор элемента
   */
  id?: string

  /**
   * Содержимое кнопки
   */
  children?: ReactNode[] | ReactNode

  /**
   * Управление отключенным состоянием кнопки
   */
  disabled?: boolean

  open?: boolean
  /**
   * Пользовательское имя класса
   */
  className?: string
  /**
   * Идентификатор для автоматизированного тестирования
   */
  dataTestId?: string
  /**
   * Обработчик вызываемый при установке фокуса на кнопке
   */
  onFocus?: React.FocusEventHandler<HTMLElement>
  /**
   * Обработчик вызываемый при потере фокуса с кнопки
   */
  onBlur?: React.FocusEventHandler<HTMLElement>
  /**
   * Обработчик вызываемый при клике на кнопку
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>
  /**
   * Обработчик вызываемый при наведении курсора мыши на кнопку
   */
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>

  notFoundContent?: ReactNode
  /**
   *  Обработчик вызываемый при смещении курсора мыши с кнопки
   */
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropdownRender?: (menu: any) => JSX.Element

  onChange?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    option: DefaultOptionType | DefaultOptionType[]
  ) => void

  placeholder?: string
  options?: DefaultOptionType[]
  onClear?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  mode?: "multiple" | "tags"
  maxTagCount?: number | "responsive"
  defaultValue?:
    | string
    | string[]
    | number
    | number[]
    | LabeledValue
    | LabeledValue[]
    | null
  allowClear?: boolean
  dropdownStyle?: React.CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDropdownVisibleChange?: (visible: any) => void
} & AriaAttributes

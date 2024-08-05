import {
  ReactNode,
  FocusEvent,
  MouseEvent,
  ButtonHTMLAttributes,
  AriaAttributes,
  ChangeEvent,
  LegacyRef,
  RefObject,
} from "react"
import { BUTTON_TYPES, BUTTON_SIZES } from "./constants"
import { InputRef } from "antd"

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
   * Тип кнопки
   */
  type?: string
  ref?: RefObject<InputRef>
  showCount?: boolean
  /**
   * Размер кнопки
   */
  size?: ButtonSize
  /**
   * Содержимое кнопки
   */
  children?: ReactNode[] | ReactNode

  /**
   * Управление отключенным состоянием кнопки
   */
  placeholder?: string
  value?: string
  maxLength?: number

  /**
   * Управление отключенным состоянием кнопки
   */
  disabled?: boolean
  /**
   * Пользовательское имя класса
   */
  className?: string

  status?: "" | "error" | "warning" | undefined
  /**
   * Идентификатор для автоматизированного тестирования
   */
  dataTestId?: string

  autoComplete?: string

  /**
   * Обработчик вызываемый при установке фокуса на кнопке
   */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  /**
   * Обработчик вызываемый при потере фокуса с кнопки
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  /**
   * Обработчик вызываемый при клике на кнопку
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /**
   * Обработчик вызываемый при наведении курсора мыши на кнопку
   */
  onMouseEnter?: (event: MouseEvent<HTMLInputElement>) => void
  /**
   *  Обработчик вызываемый при смещении курсора мыши с кнопки
   */
  onMouseLeave?: (event: MouseEvent<HTMLInputElement>) => void
} & AriaAttributes

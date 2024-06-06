import {
  ReactNode,
  FocusEvent,
  MouseEvent,
  ButtonHTMLAttributes,
  AriaAttributes,
} from "react"
import { BUTTON_TYPES, BUTTON_SIZES } from "./constants"

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
  type?: ButtonType
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
  disabled?: boolean
  /**
   * Пользовательское имя класса
   */
  className?: string
  /**
   * Идентификатор для автоматизированного тестирования
   */
  dataTestId?: string

  ref?: React.LegacyRef<HTMLElement>
  /**
   * Обработчик вызываемый при установке фокуса на кнопке
   */
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void
  /**
   * Обработчик вызываемый при потере фокуса с кнопки
   */
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void
  /**
   * Обработчик вызываемый при клике на кнопку
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void

  onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void

  /**
   * Обработчик вызываемый при наведении курсора мыши на кнопку
   */
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void
  /**
   *  Обработчик вызываемый при смещении курсора мыши с кнопки
   */
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement>) => void
} & AriaAttributes

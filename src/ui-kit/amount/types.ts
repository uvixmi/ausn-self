import { Currency } from "../common/types"
import { PREFIX_SYMBOLS } from "./constants"

type AmountStyle = "default" | "secondary" | "income" | "expense"
type DecimalStyle = "opaque" | "translucent"

export type Prefix = keyof typeof PREFIX_SYMBOLS

export type AmountProps = {
  /**
   * Значение суммы
   */
  value: number
  /**
   * Символ перед значением суммы
   */
  prefix?: Prefix
  /**
   * Символ валюты
   */
  currency?: Currency
  /**
   * Пользовательское имя класса
   */
  className?: string
  /**
   * Стиль отображения суммы
   */
  amountStyle?: AmountStyle
  /**
   * Стиль отображения десятичной части с разделителем
   */
  decimalStyle?: DecimalStyle
  /**
   * Управление отображением десятичной части
   */
  withDecimal?: boolean
  /**
   * Идентификатор для автоматизированного тестирования
   */
  dataTestId?: string
}

import {
  SPACE,
  PREFIX_SYMBOLS,
  DECIMAL_PART_SIZE,
  EMPTY_DECIMAL_PART,
  EMPTY_INTEGER_PART,
  THOUSAND_GROUP_SIZE,
} from "./constants"
import { Prefix } from "./types"

/**
 * Функция для определения является ли переданное значение числом
 *
 * Пример: isNumeric(15) -> true
 * Пример: isNumeric("123") -> false
 */
export const isNumeric = (value: unknown) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return true
  }

  return false
}

/**
 * Функция форматирования десятичной части суммы
 *
 * Пример: formatDecimalPart("1") -> "10"
 */
export const formatDecimalPart = (decimalPart: string) => {
  if (!decimalPart) {
    return EMPTY_DECIMAL_PART
  }

  return decimalPart.length < DECIMAL_PART_SIZE
    ? decimalPart + "0" // TODO: Добавить возможность работы с произвольным размером десятичной части (OB_COREUI-218)
    : decimalPart.slice(0, DECIMAL_PART_SIZE)
}

/**
 * Функция для отделения числовых разрядов пробелами
 *
 * Пример: formatIntegerPart("1234567") -> "1 234 567"
 */
export const formatIntegerPart = (integerPart: string) => {
  if (!integerPart) {
    return EMPTY_INTEGER_PART
  }

  const thousandSeparator = SPACE
  const thousandGroupPattern = new RegExp(
    `\\B(?=(\\d{${THOUSAND_GROUP_SIZE}})+(?!\\d))`,
    "g"
  )

  return integerPart.replace(thousandGroupPattern, thousandSeparator)
}

/**
 * Функция форматирования значения суммы
 *
 * Пример: formatIntegerPart(1234567.89) -> ["1 234 567", "89"]
 */
export const formatAmountValue = (amount: number) => {
  const [integerPart, decimalPart] = amount.toString().split(".")

  const formattedIntegerPart = formatIntegerPart(integerPart)
  const formattedDecimalPart = formatDecimalPart(decimalPart)

  return [formattedIntegerPart, formattedDecimalPart]
}

export const getPrefixSymbol = (prefix?: Prefix) =>
  prefix ? PREFIX_SYMBOLS[prefix] + SPACE : null

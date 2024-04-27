import { CURRENCY_SYMBOLS } from "./constants"

type Values<T> = T[keyof T]

export type Currency = keyof typeof CURRENCY_SYMBOLS
export type CurrencySymbol = Values<typeof CURRENCY_SYMBOLS>

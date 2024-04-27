import { CURRENCY_SYMBOLS } from "./constants"
import { Currency, CurrencySymbol } from "./types"

export const getCurrencySymbol = (currency: Currency): CurrencySymbol | null =>
  CURRENCY_SYMBOLS[currency] ?? null

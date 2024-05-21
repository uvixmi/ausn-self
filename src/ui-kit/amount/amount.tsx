import cn from "classnames"
import { getCurrencySymbol } from "../common/utils"
import { isNumeric, getPrefixSymbol, formatAmountValue } from "./utils"
import { DECIMAL_SEPARATOR, SPACE } from "./constants"
import { AmountProps } from "./types"
import styles from "./styles.module.scss"

export const Amount = ({
  value,
  prefix,
  className,
  withDecimal = true,
  currency = "RUB",
  dataTestId = "amount",
  amountStyle = "default",
  decimalStyle = "translucent",
}: AmountProps) => {
  const isCorrectTypeOfAmountValue = isNumeric(value)

  if (!isCorrectTypeOfAmountValue) {
    return null
  }

  const [integerPart, decimalPart] = formatAmountValue(value)

  const prefixSymbol = getPrefixSymbol(prefix)
  const currencySymbol = getCurrencySymbol(currency)

  return (
    <span
      className={cn(styles.amount, styles[amountStyle], className)}
      data-test-id={dataTestId}
    >
      {prefixSymbol}
      {integerPart}
      {withDecimal && (
        <span
          className={cn(
            styles.decimal,
            styles[amountStyle],
            styles[decimalStyle]
          )}
          data-test-id={`${dataTestId}-decimal`}
        >
          {DECIMAL_SEPARATOR}
          {decimalPart}
        </span>
      )}
      {currency && currencySymbol && SPACE && (
        <span
          className={cn(
            styles.decimal,
            styles[amountStyle],
            styles[decimalStyle]
          )}
          data-test-id={`${dataTestId}-decimal`}
        >
          {currencySymbol}
        </span>
      )}
    </span>
  )
}

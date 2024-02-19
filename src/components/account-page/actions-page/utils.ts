import { CONTENT } from "./constants"

export const formatDateString = (inputDate: string | undefined): string => {
  if (inputDate) {
    const date = new Date(inputDate)

    if (isNaN(date.getTime())) {
      return inputDate
    }

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  } else {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }
}

export const taxesQuarterHeading = (quarter: string) => {
  const quarterText = quarter.charAt(2)
  const romeQuarter =
    quarterText === "1"
      ? "I"
      : quarterText === "2"
      ? "II"
      : quarterText === "3"
      ? "III"
      : "IV"

  const yearText =
    CONTENT.TAXES_QUARTER_END + new Date().getFullYear().toString()
  return `${CONTENT.TAXES_QUARTER_TEXT} ${romeQuarter} ${yearText}`
}

export const getCurrency = (value: number, category?: string) => {
  if (category === "debet") {
    return (
      "+" +
      new Intl.NumberFormat("ru", {
        style: "currency",
        currency: "RUB",
      }).format(value)
    )
  } else if (category === "credit")
    return (
      "-" +
      new Intl.NumberFormat("ru", {
        style: "currency",
        currency: "RUB",
      }).format(value)
    )
  else
    return new Intl.NumberFormat("ru", {
      style: "currency",
      currency: "RUB",
    }).format(value)
}

import { CONTENT } from "./constants"

export const formatDateString = (
  inputDate?: string | null,
  time?: boolean
): string => {
  if (inputDate) {
    const date = new Date(inputDate)

    if (isNaN(date.getTime())) {
      return inputDate
    }

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    if (time)
      return `${day}.${month}.${year} ${String(date.getHours()).padStart(
        2,
        "0"
      )}:${String(date.getMinutes()).padStart(2, "0")}`
    else return `${day}.${month}.${year}`
  } else {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    if (time)
      return `${day}.${month}.${year} ${String(date.getHours()).padStart(
        2,
        "0"
      )}:${String(date.getMinutes()).padStart(2, "0")}`
    else return `${day}.${month}.${year}`
  }
}

export const taxesQuarterHeading = (quarter: string, year: number) => {
  const quarterText = quarter.charAt(2)
  const romeQuarter =
    quarterText === "1"
      ? "I кв"
      : quarterText === "2"
      ? "II кв"
      : quarterText === "3"
      ? "III кв"
      : ""

  const yearText =
    CONTENT.TAXES_QUARTER_END + new Date().getFullYear().toString()
  if (quarter === "ZDP") return `${CONTENT.TAXES_TAXBASE_TEXT}  ${year}`
  else if (quarterText === "1" || quarterText === "2" || quarterText === "3")
    return `${CONTENT.TAXES_QUARTER_TEXT} ${romeQuarter} ${year}`
  else return ""
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

export const compareDates = (date1: string, date2: string) => {
  const convertToISOFormat = (date: string) => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
    if (dateRegex.test(date)) {
      const [day, month, year] = date.split(".")
      return `${year}-${month}-${day}`
    }
    return date
  }

  const date1Formatted = convertToISOFormat(date1)
  const date1Obj = new Date(date1Formatted)
  date1Obj.setHours(3, 0, 0, 1)

  const date2Obj = new Date(date2)

  return date2Obj >= date1Obj ? 1 : 0
}

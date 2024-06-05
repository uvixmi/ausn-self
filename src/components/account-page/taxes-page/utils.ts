export const getSourceText = (
  sourceName: string,
  accountNumber?: string | null,
  shortName?: string | null
) => {
  if (shortName && shortName !== null) {
    const last4Digits = accountNumber
      ? `${shortName} *${accountNumber.slice(-4)}`
      : shortName
    return last4Digits
  } else {
    const last4Digits = accountNumber
      ? `${sourceName} *${accountNumber.slice(-4)}`
      : sourceName
    return last4Digits
  }
}

export const getFormattedYearDate = () => {
  const currentDate = new Date()

  const startOfYear = new Date(currentDate.getFullYear() - 1, 0, 1)

  const day = startOfYear.getDate()
  const month = startOfYear.getMonth() + 1 // Месяцы начинаются с 0, поэтому добавляем 1
  const year = startOfYear.getFullYear()

  const formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "." +
    (month < 10 ? "0" : "") +
    month +
    "." +
    year

  return formattedDate
}

export interface ApiError {
  status: number
}

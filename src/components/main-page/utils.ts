export const getWeekDayWithMonthNumber = (
  month: number,
  withNumber?: boolean
) => {
  if (month === 1) {
    return withNumber ? "января" : "январь"
  }

  if (month === 2) {
    return withNumber ? "февраля" : "февраль"
  }

  if (month === 3) {
    return withNumber ? "марта" : "март"
  }

  if (month === 4) {
    return withNumber ? "апреля" : "апрель"
  }

  if (month === 5) {
    return withNumber ? "мая" : "май"
  }

  if (month === 6) {
    return withNumber ? "июня" : "июнь"
  }

  if (month === 7) {
    return withNumber ? "июля" : "июль"
  }

  if (month === 8) {
    return withNumber ? "августа" : "август"
  }

  if (month === 9) {
    return withNumber ? "сентября" : "сентябрь"
  }

  if (month === 10) {
    return withNumber ? "октября" : "октябрь"
  }

  if (month === 11) {
    return withNumber ? "ноября" : "ноябрь"
  }

  if (month === 12) {
    return withNumber ? "декабря" : "декабрь"
  }
}

export const formatToPayDate = (dueDate: string): string | null => {
  const date = new Date(dueDate)

  if (isNaN(date.getTime())) {
    return null
  }

  const day = date.getDate()
  const month = getWeekDayWithMonthNumber(date.getMonth() + 1, true)
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

export const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export const convertDateFormat = (inputDate: string): string => {
  const dateParts: string[] = inputDate.split(".")

  const newDateFormat: string = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`

  return newDateFormat
}

export const convertReverseFormat = (inputDate: string): string => {
  const dateParts: string[] = inputDate.split("-")

  const newDateFormat: string = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`

  return newDateFormat
}

export const getCurrentDate = () => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}

export const numberWithSpaces = (amount: string) => {
  const parts = amount.toString().split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  return parts.join(".")
}

export const isValidDate = (dateString: string): boolean => {
  const dateFormat = /^\d{2}\.\d{2}\.\d{4}$/
  if (!dateFormat.test(dateString)) {
    return false
  }

  const [day, month, year] = dateString.split(".").map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

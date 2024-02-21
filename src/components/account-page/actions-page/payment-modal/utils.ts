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

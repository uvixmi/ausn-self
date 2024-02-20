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

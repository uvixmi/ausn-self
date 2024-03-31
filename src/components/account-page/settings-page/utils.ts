export const getRateReason = (reasonString: string): string | undefined => {
  const formatRegex = /^\d{7}\/\d{4}\d{4}\d{4}$/
  if (!formatRegex.test(reasonString)) {
    return undefined
  }

  const reasons: { [key: string]: string } = {
    "3462010": "",
    "3462020": "",
    "3462030": "Предприниматель Крыма или Севастополя,",
    "3462040": "Налоговые каникулы,",
  }

  const parts: string[] = reasonString.split("/")
  const reason: string = reasons[parts[0]]

  if (!reason && reason !== "") return "Неверный формат причины"

  const article: string = parts[1].substring(0, 4).replace(/^0+/, "")
  const section: string = parts[1].substring(4, 8).replace(/^0+/, "")
  const subsection: string = parts[1].substring(8, 12).replace(/^0+/, "")

  let formattedString: string = `Обоснование сниженной ставки: ${reason} статья ${article}`

  if (section !== "0" && section !== "") {
    formattedString += `, пункт ${section}`

    if (subsection !== "0" && subsection !== "") {
      formattedString += `, подпункт ${subsection}`
    }
  }

  return formattedString
}

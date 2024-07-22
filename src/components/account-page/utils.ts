export function abbreviateFullName(
  fullName?: string | null
): string | undefined {
  if (fullName) {
    // Определяем слова, которые нужно заменить
    const replacements = {
      "Общество с ограниченной ответственностью": "ООО",
      "Общество с ограниченной ответст-венностью": "ООО", // учтем возможные вариации
    }

    // Заменяем длинные слова их сокращениями
    let abbreviatedName = fullName
    for (const [longForm, shortForm] of Object.entries(replacements)) {
      abbreviatedName = abbreviatedName.replace(longForm, shortForm)
    }

    // Разделяем оставшуюся часть названия по пробелам
    const nameParts = abbreviatedName.split(' "')

    // Если есть кавычки, обрабатываем отдельно
    if (nameParts.length > 1) {
      let coreName = nameParts[1].replace(/"/g, "")
      const coreNameParts = coreName.split(" ")

      // Если основное название слишком длинное, сокращаем его до первого слова с добавлением "..."
      if (coreNameParts.length > 1) {
        coreName = coreNameParts[0] + "..."
      }

      return `${nameParts[0]} "${coreName}"`
    }

    // Если кавычек нет, просто возвращаем результат
    return abbreviatedName
  }
  return undefined
}

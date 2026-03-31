/**
 * return now date withtout hours/minutes/secondes
 *
 * @function
 * @name nowDate
 * @kind variable
 * @returns {Date}
 * @exports
 */
export const nowDate = (): Date => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  return now
}

/**
 * format date with/witout minutes/hours if needed
 *
 * @function
 * @name formatDate
 * @kind variable
 * @param {Date} date
 * @param {string} locale
 * @returns {string}
 * @exports
 */
export const formatDate = (date: Date, locale: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: date.getHours() ? 'numeric' : undefined,
    minute: date.getMinutes() ? 'numeric' : undefined,
  })
}

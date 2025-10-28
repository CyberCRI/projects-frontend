import { capitalize as esCapitalize } from 'es-toolkit'
/**
 * crop text if is too long
 *
 * @function
 * @name cropIfTooLong
 * @kind variable
 * @param {string} text
 * @param {number} length
 * @returns {string}
 * @exports
 */
export const cropIfTooLong = (text: string | null, length: number): string => {
  if (text) {
    return text.length > length ? text.substring(0, length) + '...' : text
  }
  return ''
}

export const capitalize = (text: string | undefined | null): string => {
  if (!text) {
    return ''
  }
  return esCapitalize(text)
}

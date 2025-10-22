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

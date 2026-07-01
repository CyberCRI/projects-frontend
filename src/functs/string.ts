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

export function safeParseFloat(s: any, fallback: number = 0): number {
  if (!s) return fallback
  if (typeof s === 'number') return s
  try {
    const res = parseFloat('' + s)
    if (isNaN(res)) throw 'Not a number'
    return res
  } catch (err) {
    console.error(`parseFLoat error for ${s}`, err)
    return fallback
  }
}

export function safeParseInt(s: any, fallback: number = 0): number {
  if (!s) return fallback
  if (typeof s === 'number') return Math.floor(s)
  try {
    const res = parseInt('' + s, 10)
    if (isNaN(res)) throw 'Not a number'
    return res
  } catch (err) {
    console.error(`parseInt error for ${s}`, err)
    return fallback
  }
}

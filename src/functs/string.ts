import { capitalize as esCapitalize, isNil } from 'es-toolkit'

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

/**
 * convert html string based to text string (without html tags)
 *
 * @function
 * @name html2Text
 * @kind variable
 * @param {string} text
 * @returns {string}
 * @exports
 */
export const html2Text = (text: string): string => {
  if (!import.meta.client) {
    return ''
  }
  const span = document.createElement('span')
  span.innerHTML = text || ''
  return span.innerText
}

/**
 * check if text is empty (from html context like "<p></p>")
 *
 * @function
 * @name textIsEmpty
 * @kind variable
 * @param {string} text
 * @returns {boolean}
 * @exports
 */
export const textIsEmpty = (text: string | null): boolean => {
  if (isNil(text)) {
    return true
  }
  return html2Text(text).trim() === ''
}

export function isHtmlNotEmpty(html: string): boolean {
  if (!document) return !!html // dummy fix for server side
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent.trim() !== ''
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

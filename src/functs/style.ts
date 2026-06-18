/**
 * convert rem number to pixel number
 *
 * @function
 * @name remToPx
 * @kind variable
 * @param {number} rem
 * @returns {number}
 * @exports
 */
export const remToPx = (rem: number): number => {
  if (!import.meta.client) {
    return 0
  }
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

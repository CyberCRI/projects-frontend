/**
 * generate unique Id
 *
 * @function
 * @name useUniqueId
 * @kind variable
 * @returns {string}
 * @exports
 */
export const useUniqueId = () => {
  return (Math.random() + 1).toString(36).substring(7)
}

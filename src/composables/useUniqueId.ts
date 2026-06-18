/**
 * generate unique Id
 *
 * @function
 * @name useUniqueId
 * @kind variable
 * @returns {string}
 * @exports
 */
export const useUniqueId = (maxLenght: number = 8): string => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let id: string = ''
  for (let i = 0; i < maxLenght; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}

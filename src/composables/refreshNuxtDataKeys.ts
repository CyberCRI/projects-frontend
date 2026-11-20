export const asyncKeyEqual = (userKey: string, nuxtKey: string): boolean => {
  return userKey === nuxtKey
}

export const asyncKeyStartWith = (userKey: string, nuxtKey: string): boolean => {
  return nuxtKey.startsWith(userKey)
}

/**
 * refresh all matching user keys
 *
 * @function
 * @name findedAsyncKeys
 * @kind variable
 * @param {string[]} keys
 * @param {(userKey: string, nuxtKey: string) => boolean} finded?
 * @returns {string[]}
 * @exports
 */
export const findedAsyncKeys = (
  keys: string[],
  finded: (userKey: string, nuxtKey: string) => boolean = asyncKeyStartWith
): string[] => {
  const nuxt = useNuxtApp()

  const nuxtKeys = Object.keys(nuxt.payload.data)

  const findedKeys = new Set<string>()

  keys.forEach((userKey) => {
    nuxtKeys.forEach((nuxtKey) => {
      if (finded(userKey, nuxtKey)) {
        findedKeys.add(nuxtKey)
      }
    })
  })

  return [...findedKeys]
}

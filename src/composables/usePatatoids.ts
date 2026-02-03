const DEFAULT_PATATOID = [1, 2, 3, 4, 5, 6].map(
  (index) => `/patatoids-project/Patatoid-${index}.png`
)

const DEFAULT_USER_PATATOID = DEFAULT_PATATOID[0]
const DEFAULT_GROUP_PATATOID = DEFAULT_PATATOID[1]
const DEFAULT_PROJECT_PATATOID = DEFAULT_PATATOID[2]
const DEFAULT_IMAGE_PATATOID = DEFAULT_PATATOID[3]

/**
 * return default 6 patatoids
 *
 * @function
 * @name usePatatoids
 * @kind variable
 * @returns {string[]}
 */
const usePatatoids = () => {
  const runtimeConfig = useRuntimeConfig()
  return DEFAULT_PATATOID.map((url) => `${runtimeConfig.public.appPublicBinariesPrefix}${url}`)
}

export {
  usePatatoids,
  DEFAULT_USER_PATATOID,
  DEFAULT_PATATOID,
  DEFAULT_GROUP_PATATOID,
  DEFAULT_PROJECT_PATATOID,
  DEFAULT_IMAGE_PATATOID,
}

import { usePublicURL } from '@/composables/usePublic'

const urlPatatoid = (index: string | number) => `/patatoids-project/Patatoid-${index}.png`

const DEFAULT_USER_PATATOID = urlPatatoid(0)
const DEFAULT_GROUP_PATATOID = urlPatatoid(1)
const DEFAULT_PROJECT_PATATOID = urlPatatoid(2)
const DEFAULT_IMAGE_PATATOID = urlPatatoid(3)
const DEFAULT_NEWS_PATATOID = urlPatatoid(4)

/**
 * Description
 *
 * @function
 * @name usePatatoid
 * @kind variable
 * @param {string | number} index
 * @returns {string}
 */
const usePatatoid = (index: string | number) => {
  return usePublicURL(urlPatatoid(index))
}

/**
 * return default 6 patatoids
 *
 * @function
 * @name usePatatoids
 * @kind variable
 * @param {number} number?
 * @returns {string[]}
 */
const usePatatoids = (number: number = 6) => {
  return Array.from(Array(number).keys()).map((index) => usePatatoid(index))
}

/**
 * get file from patatoid
 *
 * @async
 * @function
 * @name getPatatoidFile
 * @kind variable
 * @param {string | number} index
 * @returns {Promise<File>}
 */
const getPatatoidFile = async (index: string | number) => {
  const url = usePatatoid(index)
  const urlDefault = usePatatoid(1)

  return useAPI(url, { responseType: 'blob' })
    .catch(() => useAPI(urlDefault, { responseType: 'blob' }))
    .then((response) => {
      const fileName = response.split('/').at(-1)
      return new File([response.blob], fileName)
    })
    .catch(() => new File([], ''))
}

export {
  usePatatoid,
  usePatatoids,
  getPatatoidFile,
  DEFAULT_USER_PATATOID,
  DEFAULT_GROUP_PATATOID,
  DEFAULT_PROJECT_PATATOID,
  DEFAULT_IMAGE_PATATOID,
  DEFAULT_NEWS_PATATOID,
}

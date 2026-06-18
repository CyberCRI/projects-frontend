import { usePublicURL } from '~/composables/usePublic'

import { getFileFromURL } from '~/api/utils.service'
import { range } from 'es-toolkit'

const urlPatatoid = (index: string | number) => {
  if (parseInt(index.toString(), 10) <= 0) {
    console.error(`can't get patatoids index less than zero: index=${index}`)
    index = 1
  }
  return `/patatoids-project/Patatoid-${index}.png`
}
const DEFAULT_USER_PATATOID = urlPatatoid(1)
const DEFAULT_GROUP_PATATOID = urlPatatoid(2)
const DEFAULT_PROJECT_PATATOID = urlPatatoid(3)
const DEFAULT_IMAGE_PATATOID = urlPatatoid(4)
const DEFAULT_NEWS_PATATOID = urlPatatoid(5)
const DEFAULT_ANNOUNCEMENT_PATATOID = urlPatatoid(6)

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
const usePatatoids = (number: number = 7) => {
  return range(1, number).map((index) => usePatatoid(index))
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
  const indexDefault = 1

  return (
    getFileFromURL(usePatatoid(index))
      // if we can't get index patatoid, fetch default index
      .catch(() => getFileFromURL(usePatatoid(indexDefault)))
      // if error return empty file
      .catch(() => new File([], 'error.png'))
  )
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
  DEFAULT_ANNOUNCEMENT_PATATOID,
}

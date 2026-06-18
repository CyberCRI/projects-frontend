import type { SearchParams } from '~/api/types'

export function _adaptParamsToGetQuery(params: SearchParams) {
  return {
    params: params
      ? Object.entries(params)
          .map((entry) => [entry[0], Array.isArray(entry[1]) ? entry[1].join(',') : entry[1]])
          .reduce((acc, cur) => {
            acc[cur[0]] = cur[1]
            return acc
          }, {})
      : {},
  }
}

export const getFileFromURL = (url: string, filename?: string) => {
  filename ??= url.split('/').at(-1)
  return $fetch<Blob>(url, { responseType: 'blob' }).then((blob) => {
    return new File([blob], filename)
  })
}

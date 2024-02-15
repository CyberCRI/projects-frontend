import { SearchParams } from '@/api/projects.service'

export function _adaptParamsToGetQuery(params: SearchParams) {
    return {
        params: params
            ? Object.entries(params)
                  .map((entry) => [
                      entry[0],
                      Array.isArray(entry[1]) ? entry[1].join(',') : entry[1],
                  ])
                  .reduce((acc, cur) => {
                      acc[cur[0]] = cur[1]
                      return acc
                  }, {})
            : {},
    }
}

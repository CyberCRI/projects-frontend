import { _adaptParamsToGetQuery } from '~/api/utils.service'

import type {
  QueryFilterSearch,
  SearchResultAll,
  SearchResultGroup,
  SearchResultProject,
  SearchResultUser,
} from '~/models/search.model'
import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

type Config = UseApiOptions<QueryFilterSearch>

export async function searchAll<T = SearchResultAll>(search: string, config: Config = {}) {
  const url = `search/${search ? `${encodeURIComponent(search)}/` : ''}`
  return useAPI<PaginationResult<T>>(url, config)
}

export function searchProjects(search: string, config: Config = {}) {
  return searchAll<SearchResultProject>(search, {
    ...config,
    query: {
      ...(config.query || {}),
      types: ['project'],
    },
  })
}

export function searchUser(search: string, config: Config = {}) {
  return searchAll<SearchResultUser>(search, {
    ...config,
    query: {
      ...(config.query || {}),
      types: ['user'],
    },
  })
}

export function searchGroups(search: string, config: Config = {}) {
  return searchAll<SearchResultGroup>(search, {
    ...config,
    query: {
      ...(config.query || {}),
      types: ['people_group'],
    },
  })
}

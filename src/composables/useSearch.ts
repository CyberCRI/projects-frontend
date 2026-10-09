import type { QueryFilterSearch } from 'shared-projects-frontend/models'
import { deepToRaw } from '~/functs/utils'
import { isEqual } from 'es-toolkit'

const MAX_LIMIT_SEARCH = 30

export const sanitizeSearchQuery = (query: QueryFilterSearch): QueryFilterSearch => {
  if (!Array.isArray(query.tags)) {
    query.tags = []
  }

  if (!Array.isArray(query.categories)) {
    query.categories = []
  }
  if (!Array.isArray(query.skills)) {
    query.skills = []
  }

  if (query.limit && typeof query.limit !== 'string') {
    query.limit = parseInt(query.limit.toString()) || MAX_LIMIT_SEARCH
  } else {
    query.limit = MAX_LIMIT_SEARCH
  }

  return query
}

export const useSearchV2 = (defaultValue: QueryFilterSearch = {}) => {
  const { query, setQuery, setQuerys, toggleQuery, removeQuery } = useQuery<QueryFilterSearch>(
    sanitizeSearchQuery({
      ...(defaultValue || {}),
      modules: ['members', 'subgroups'],
    }),
    {
      getRouteQuery: true,
      setRouteQuery: true,
    }
  )
  const search = ref('')

  const sanitizeQuery = computed(() => sanitizeSearchQuery(deepToRaw(query.value)))

  // safeQuery
  watch(
    query,
    (nnew, old) => {
      if (!isEqual(sanitizeSearchQuery(deepToRaw(nnew)), deepToRaw(old))) {
        setQuerys(sanitizeSearchQuery(deepToRaw(nnew)))
      }
    },
    { deep: true }
  )

  return {
    query: sanitizeQuery,
    setQuery,
    toggleQuery,
    setQuerys,
    removeQuery,
    search,
  }
}

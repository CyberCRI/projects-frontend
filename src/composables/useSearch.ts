import type { QueryFilterSearch } from 'shared-projects-frontend/models'

export const useSearchV2 = (defaultValue: QueryFilterSearch = {}) => {
  const { query, setQuery, setQuerys, toggleQuery, removeQuery } = useQuery<QueryFilterSearch>(
    {
      limit: 30,
      ...(defaultValue || {}),
    },
    {
      routeQuery: true,
    }
  )
  const search = ref('')

  return {
    query,
    setQuery,
    toggleQuery,
    setQuerys,
    removeQuery,
    search,
  }
}

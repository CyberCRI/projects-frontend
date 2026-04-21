/**
 * easy query params interact for filters
 *
 * @constant
 * @name useQuery
 * @kind variable
 * @type {<DataQuery = { [key: string]: string | number | boolean; }>(defaultValue: Partial<DataQuery>) => { query: Ref<Partial<DataQuery>>; setQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; removeQuery: <K extends keyof DataQuery>(key: K) => void; toggleQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; }}
 * @exports
 */
export const useQuery = <DataQuery = { [key: string]: string | number | boolean }>(
  defaultValue: Partial<DataQuery>
) => {
  const query = ref<Partial<DataQuery>>(defaultValue ?? {})

  const setQuery = <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => {
    query.value[key] = value
  }

  const setQuerys = (datas: Partial<DataQuery>) => {
    query.value = datas
  }

  const removeQuery = <K extends keyof DataQuery>(key: K) => {
    delete query.value[key]
  }

  /**
   * toggle value in object ( if exists with the same value, remove it else set it)
   */
  const toggleQuery = <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => {
    if (query.value[key] === value) {
      removeQuery(key)
    } else {
      setQuery(key, value)
    }
  }

  return {
    query,
    setQuery,
    setQuerys,
    removeQuery,
    toggleQuery,
  }
}

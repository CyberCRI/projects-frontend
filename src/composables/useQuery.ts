/**
 * easy query params interact for filters
 *
 * @constant
 * @name useQuery
 * @kind variable
 * @type {<DataQuery = { [key: string]: string | number | boolean; }>(defaultValue: Partial<DataQuery>) => { query: Reactive<Partial<DataQuery>>; setQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; removeQuery: <K extends keyof DataQuery>(key: K) => void; toggleQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; }}
 * @exports
 */
export const useQuery = <DataQuery = { [key: string]: string | number | boolean }>(
  defaultValue: Partial<DataQuery>
) => {
  const query = reactive<Partial<DataQuery>>(defaultValue ?? {})

  const setQuery = <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => {
    ;(query as Record<K, DataQuery[K]>)[key] = value
  }

  const removeQuery = <K extends keyof DataQuery>(key: K) => {
    delete (query as Record<K, DataQuery[K]>)[key]
  }

  /**
   * toggle value in object ( if exists with the same value, remove it else set it)
   */
  const toggleQuery = <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => {
    if ((query as Record<K, DataQuery[K]>)[key] === value) {
      removeQuery(key)
    } else {
      setQuery(key, value)
    }
  }

  return {
    query,
    setQuery,
    removeQuery,
    toggleQuery,
  }
}

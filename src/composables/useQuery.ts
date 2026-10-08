import { deepToRaw } from '~/functs/utils'
import { isEqual } from 'es-toolkit'

type QueryOptions = {
  // watch/set query to route
  routeQuery: boolean
}

const defaultOptions = (): QueryOptions => {
  return {
    routeQuery: false,
  }
}

/**
 * easy query params interact for filters
 *
 * @constant
 * @name useQuery
 * @kind variable
 * @type {<DataQuery = { [key: string]: string | number | boolean; }>(defaultValue: Partial<DataQuery>, options?: Partial<QueryOptions>) => { query: [Partial<DataQuery>] extends [globalThis.Ref<any, any>] ? IfAny<globalThis.Ref<any, any> & Partial<DataQuery>, globalThis.Ref<globalThis.Ref<any, any> & Partial<DataQuery>, globalThis.Ref<any, any> & Partial<DataQuery>>, globalThis.Ref<any, any> & Partial<...>> : globalThis.Ref<...>; setQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; setQuerys: (datas: Partial<DataQuery>) => void; removeQuery: <K extends keyof DataQuery>(key: K) => void; toggleQuery: <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => void; }}
 * @exports
 */
export const useQuery = <DataQuery = { [key: string]: string | number | boolean }>(
  defaultValue: Partial<DataQuery>,
  options: Partial<QueryOptions> = null
) => {
  options ??= defaultOptions()
  if (options.routeQuery) {
    const route = useRoute()
    defaultValue = {
      ...deepToRaw(route?.query || {}),
      ...(defaultValue || {}),
    }
  }

  const query = ref<Partial<DataQuery>>(defaultValue ?? {})

  const setQuerys = (datas: Partial<DataQuery>) => {
    query.value = datas
  }

  const setQuery = <K extends keyof DataQuery>(key: K, value: DataQuery[K]) => {
    console.log('push query', {
      ...deepToRaw(query.value),
      [key]: value,
    })
    setQuerys({
      ...deepToRaw(query.value),
      [key]: value,
    })
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

  if (options.routeQuery) {
    const router = useRouter()
    const route = useRoute()

    watch(
      () => route.query,
      () => {
        const nn = deepToRaw({
          ...query.value,
          ...route.query,
        })
        console.log('watchRouteQuery', nn)
        if (!isEqual(query.value, nn)) {
          query.value = nn
        }
      },
      { deep: true }
    )

    watch(
      query,
      (old, nnew) => {
        if (!isEqual(old, nnew)) {
          console.log('newWatch', route.query, deepToRaw(query.value))
          router.push({ query: deepToRaw(query.value) })
        }
      },
      { deep: true }
    )
  }

  return {
    query,
    setQuery,
    setQuerys,
    removeQuery,
    toggleQuery,
  }
}

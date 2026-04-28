import type { RefOrRaw } from '~/interfaces/utils'

type useAsyncConfig = Parameters<typeof useAsyncAPI<any, any, any>>['2']
type useAsyncPaginationConfig = Parameters<typeof useAsyncPaginationAPI>['2']

export type UseAsyncApiConfig<Query = useAsyncConfig['query']> = {
  query?: RefOrRaw<Query>
  default?: () => any
} & Pick<useAsyncConfig, 'immediate'>

export type UseAsyncPaginationApiConfig<Query = useAsyncConfig['query']> = {
  // remove PaginationQuery (use paginationConfig)
  query?: RefOrRaw<Omit<Query, keyof PaginationQuery>>
  default?: () => any
} & Pick<useAsyncPaginationConfig, 'paginationConfig' | 'immediate'>

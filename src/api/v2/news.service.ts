import type { NewsModel, QueryFilterNews } from '~/models/news.model'
import type { OrganizationModel } from '~/models/organization.model'

import type { RefOrRaw } from '~/interfaces/utils'

import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'
import { getAllNews as fetchAllNews, getNews as fetchNews } from '~/api/news.service'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterNews>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterNews>

export const getAllNews = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateNews } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::news::all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllNews(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateNews(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getNews = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  newsId: RefOrRaw<NewsModel['id']>,
  config: Config = {}
) => {
  const { translateOneNews } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::news::${unref(newsId)}`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchNews(unref(organizationCode), unref(newsId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateOneNews(data),
      watch: onlyRefs([organizationCode, newsId]),
      ...config,
    }
  )
}

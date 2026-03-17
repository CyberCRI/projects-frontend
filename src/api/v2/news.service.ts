import { getNews as fetchNews } from '@/api/news.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { NewsModel } from '@/models/news.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getNews = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  newsId: RefOrRaw<NewsModel['id']>,
  config = {}
) => {
  const { translateOneNews } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::news::${newsId}`)

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

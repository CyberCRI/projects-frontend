import type {
  QueryFilterSearch,
  SearchResultAll,
  SearchResultGroup,
  SearchResultProject,
  SearchResultUser,
  TranslatedSearchResultAll,
  TranslatedSearchResultGroup,
  TranslatedSearchResultProject,
  TranslatedSearchResultUser,
} from '~/models/search.model'
import { searchAll, searchGroups, searchProjects, searchUser } from '~/api/search.service'
import { getOrgClassificationTags } from '~/api/tag-classification.service'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterSearch>

// TODO change backend with prefix organization code in url
export const getSearchAll = (
  organization: RefOrRaw<OrganizationModel['code']>,
  search: RefOrRaw<string>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::search::all`)
  const { translateUser, translateGroup, translateProject } = useAutoTranslate()

  const translatedSearch = (datas: SearchResultAll[]) => {
    return computed<TranslatedSearchResultAll[]>(() => {
      const rawData = unref(datas)

      if (!rawData) {
        return []
      }

      const translated = rawData.map((item) => {
        switch (item.type) {
          case 'user':
            return {
              ...item,
              user: unref(translateUser(item.user)),
            }
          case 'people_group':
            return {
              ...item,
              people_group: unref(translateGroup(item.people_group)),
            }
          case 'project':
            return {
              ...item,
              project: unref(translateProject(item.project)),
            }
        }
      })

      return translated
    })
  }

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      searchAll(unref(search), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translatedSearch(data),
      watch: onlyRefs([search, organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url
export const getSearchProjects = (
  organization: RefOrRaw<OrganizationModel['code']>,
  search: RefOrRaw<string>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::search::projects`)
  const { translateProject } = useAutoTranslate()

  const translatedSearch = (datas: SearchResultProject[]) => {
    return computed<TranslatedSearchResultProject[]>(() => {
      const rawData = unref(datas)

      if (!rawData) {
        return []
      }

      const translated = rawData.map((item) => {
        switch (item.type) {
          case 'project':
            return {
              ...item,
              project: unref(translateProject(item.project)),
            }
        }
      })

      return translated
    })
  }

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      searchProjects(unref(search), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translatedSearch(data),
      watch: onlyRefs([search, organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url
export const getSearchUser = (
  organization: RefOrRaw<OrganizationModel['code']>,
  search: RefOrRaw<string>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::search::user`)
  const { translateUser } = useAutoTranslate()

  const translatedSearch = (datas: SearchResultUser[]) => {
    return computed<TranslatedSearchResultUser[]>(() => {
      const rawData = unref(datas)

      if (!rawData) {
        return []
      }

      const translated = rawData.map((item) => {
        switch (item.type) {
          case 'user':
            return {
              ...item,
              user: unref(translateUser(item.user)),
            }
        }
      })

      return translated
    })
  }

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      searchUser(unref(search), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translatedSearch(data),
      watch: onlyRefs([search, organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url
export const getSearchGroup = (
  organization: RefOrRaw<OrganizationModel['code']>,
  search: RefOrRaw<string>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::search::group`)
  const { translateGroup } = useAutoTranslate()

  const translatedSearch = (datas: SearchResultGroup[]) => {
    return computed<TranslatedSearchResultGroup[]>(() => {
      const rawData = unref(datas)

      if (!rawData) {
        return []
      }

      const translated = rawData.map((item) => {
        switch (item.type) {
          case 'people_group':
            return {
              ...item,
              people_group: unref(translateGroup(item.people_group)),
            }
        }
      })

      return translated
    })
  }

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      searchGroups(unref(search), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translatedSearch(data),
      watch: onlyRefs([search, organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url
export const getSearchTag = (
  organization: RefOrRaw<OrganizationModel['code']>,
  classificationType: RefOrRaw<'enabled-for-projects' | 'enabled-for-skills'>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::search::project::tags`)
  const { translateTags } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      getOrgClassificationTags(unref(organization), unref(classificationType), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateTags(data),
      watch: onlyRefs([classificationType, organization]),
      ...config,
    }
  )
}

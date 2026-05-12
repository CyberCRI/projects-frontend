import {
  getProjectAnnouncements as fetchProjectAnnouncements,
  getAnnouncements as fetchAnnouncements,
} from '@/api/announcements.service'
import type { QueryFilterAnnouncement } from '@/models/announcement.model'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterAnnouncement>

// TODO change backend with prefix organization code in url
export const getAnnouncements = (
  organization: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::announcements::all`)

  const { translateAnnouncements } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAnnouncements({
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateAnnouncements,
      watch: onlyRefs([organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url
export const getProjectAnnouncements = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::announcements::all`
  )

  const { translateAnnouncements } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectAnnouncements(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateAnnouncements,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

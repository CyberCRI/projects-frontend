import { getProjectAnnouncements as fetchProjectAnnouncements } from '@/api/announcements.service'
import type { QueryFilterAnnouncement } from '@/models/announcement.model'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterAnnouncement>

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

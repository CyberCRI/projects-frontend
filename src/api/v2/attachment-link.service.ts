import { getProjectAttachmentLinks as fetchProjectAttachmentLinks } from '~/api/attachment-links.service'
import type { QueryFilterBlogEntry } from 'shared-projects-frontend/models/blog-entry.model'
import type { OrganizationModel } from 'shared-projects-frontend/models/organization.model'
import type { ProjectSlugOrId } from 'shared-projects-frontend/models/project.model'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterBlogEntry>

// TODO change backend with prefix organization code in url
export const getProjectAttachmentLinks = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::attachment::links::all`
  )

  const { translateLinks } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectAttachmentLinks(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateLinks(data),
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

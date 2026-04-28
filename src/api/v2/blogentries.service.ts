import { getBlogEntries as fetchBlogEntries } from '@/api/blogentries.service'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { QueryFilterBlogEntry } from '@/models/blog-entry.model'
import type { OrganizationModel } from '@/models/organization.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterBlogEntry>

// TODO change backend with prefix organization code in url
export const getBlogEntries = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::blogentires::all`
  )

  const { translateBlogEntries } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchBlogEntries(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateBlogEntries,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

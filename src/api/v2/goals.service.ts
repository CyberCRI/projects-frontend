import { getAllGoals as fetchAllGoals } from '@/api/goals.service'
import { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import { ProjectSlugOrId } from '@/models/project.model'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url
export const getAllGoals = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::goals:all`
  )

  const { translateGoals } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllGoals(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateGoals,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

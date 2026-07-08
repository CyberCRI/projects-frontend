import type { OrganizationModel, ProjectSlugOrId } from 'shared-projects-frontend/models'
import { getProjectGoals as fetchProjectGoals } from 'shared-projects-frontend/apis'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url
export const getProjectGoals = (
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
      fetchProjectGoals(unref(projectSlugOrId), {
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

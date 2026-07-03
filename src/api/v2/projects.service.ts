import type { QueryFilterProject } from 'shared-projects-frontend/models/project-member.model'
import type { OrganizationModel } from 'shared-projects-frontend/models/organization.model'
import type { ProjectSlugOrId } from 'shared-projects-frontend/models/project.model'
import { getProject as fetchProject } from '@/api/projects.service'
import type { UseAsyncApiConfig } from '~/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

export const getProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  projectId: RefOrRaw<ProjectSlugOrId>,
  config: UseAsyncApiConfig<QueryFilterProject> = {}
) => {
  const { translateProject } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::project::${unref(projectId)}`)

  return useAsyncAPI(
    key,
    ({ config }) => fetchProject(unref(projectId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateProject,
      watch: onlyRefs([organizationCode, projectId]),
      ...config,
    }
  )
}

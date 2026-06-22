import type { OrganizationModel } from '@/models/organization.model'
import { getProject as fetchProject } from '@/api/projects.service'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

export const getProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  projectId: RefOrRaw<ProjectSlugOrId>,
  config = {}
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

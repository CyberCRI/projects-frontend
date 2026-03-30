import { getProject as fetchProject } from '@/api/projects.service'
import useAsyncAPI from '@/composables/useAsyncAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import { ProjectSlugOrId } from '@/models/project.model'

const DEFAULT_CONFIG = {}

export const getProject = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  projectId: RefOrRaw<ProjectSlugOrId>,
  config = {}
) => {
  const { translateProject } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::project::${unref(projectId)}`)

  return useAsyncAPI(key, () => fetchProject(unref(projectId), { ...DEFAULT_CONFIG }), {
    translate: translateProject,
    watch: onlyRefs([organizationCode, projectId]),
    ...config,
  })
}

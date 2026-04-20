import { getProject as fetchProject } from '@/api/projects.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import { ProjectSlugOrId } from '@/models/project.model'

const DEFAULT_CONFIG = {}

// TODO change backend with prefix organization code in url
export const getProject = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config = {}
) => {
  const key = computed(() => `${unref(organization)}::project::${unref(projectSlugOrId)}`)

  const { translateProject } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchProject(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProject,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

export const getProjectMembers = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config = {}
) => {
  const key = computed(() => `${unref(organization)}::project::${unref(projectSlugOrId)}::members`)

  const { translateUsers } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProject(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateUsers,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

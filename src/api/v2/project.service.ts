import { getProjectLocations as fetchProjectLocations } from '@/api/locations.services'
import {
  getProject as fetchProject,
  getLinkedProject as fetchLinkedProject,
  getProjectMembers as fetchProjectMembers,
} from '@/api/projects.service'
import { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'
import { QueryFilterProjectMembers, TranslatedPojectMember } from '@/models/project-member.model'
import { ProjectSlugOrId } from '@/models/project.model'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig
type ConfigPagination = UseAsyncPaginationApiConfig

type ConfigPaginationMembers = UseAsyncPaginationApiConfig<QueryFilterProjectMembers>

// TODO change backend with prefix organization code in url
export const getProject = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: Config = {}
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

// TODO change backend with prefix organization code in url
export const getLinkedProject = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::linked::all`
  )

  const { translatedProjectLinkeds } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchLinkedProject(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translatedProjectLinkeds,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

export const getProjectMembers = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPaginationMembers = {}
) => {
  const key = computed(() => `${unref(organization)}::project::${unref(projectSlugOrId)}::members`)

  const { translateUsers } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectMembers(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateUsers<TranslatedPojectMember>(data),
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

export const getProjectLocations = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::project::${unref(projectSlugOrId)}::members`)

  const { translateLocations } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchProjectLocations(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateLocations,
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

import type { OrganizationModel } from 'shared-projects-frontend/models/organization.model'
import type { ProjectSlugOrId } from 'shared-projects-frontend/models/project.model'
import type { TagModel } from 'shared-projects-frontend/models/tag.model'
import type { UseApiOptions } from '~/composables/useAPI'
import useAPI from '~/composables/useAPI'

type Config = UseApiOptions<{
  publication_status: string
}>

export type Stats = {
  total: number
  by_sdg: {
    sdg: number
    project_count: number
  }[]
  by_month: {
    month: string
    created_count: number
    updated_count: number
  }[]
  top_tags: (TagModel & {
    project_count: number
    projects: ProjectSlugOrId[]
  })[]
}

export async function getStats(
  orgaizationCode: OrganizationModel['code'],
  config: Config = {
    query: { publication_status: 'all' },
  }
) {
  // waiting for https://github.com/CyberCRI/projects-api-Reloaded/issues/241
  return await useAPI<Stats>(`organization/${orgaizationCode}/stats/`, config)
}

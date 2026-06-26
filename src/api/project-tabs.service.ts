import type {
  ProjectTab,
  ProjectTabForm,
  ProjectTabItem,
  ProjectTabItemForm,
  QueryFilterProjectTab,
  QueryFilterProjectTabItem,
} from '~/models/projects-tabs.model'
import type { ProjectSlugOrId } from '~/models/project.model'
import type { ImageModelCreated } from '~/models/image.model'

type Config = UseApiOptions
type ConfigTab = UseApiOptions<QueryFilterProjectTab>
type ConfigTabItem = UseApiOptions<QueryFilterProjectTabItem>

export async function getAllProjectTab(projectId: ProjectSlugOrId, config: ConfigTab = {}) {
  return await useAPI<PaginationResult<ProjectTab>>(`project/${projectId}/tab/`, config)
}

export async function getProjectTab(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  config: Config = {}
) {
  return await useAPI<ProjectTab>(`project/${projectId}/tab/${projectTabId}/`, config)
}

export async function createProjectTab(
  projectId: ProjectSlugOrId,
  body: ProjectTabForm,
  config: Config = {}
) {
  return await useAPI<ProjectTab>(`project/${projectId}/tab/`, {
    method: 'POST',
    body,
    ...config,
  })
}

export async function updateProjectTab(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  body: ProjectTabForm,
  config: Config = {}
) {
  return await useAPI<ProjectTab>(`project/${projectId}/tab/${projectTabId}/`, {
    method: 'PATCH',
    body,
    ...config,
  })
}

export async function deleteProjectTab(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  config: Config = {}
) {
  return await useAPI<undefined>(`project/${projectId}/tab/${projectTabId}/`, {
    method: 'DELETE',
    ...config,
  })
}

// tabitems

export async function getAllProjectTabItem(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  config: ConfigTabItem = {}
) {
  // await delay(40000)
  return await useAPI<PaginationResult<ProjectTabItem>>(
    `project/${projectId}/tab/${projectTabId}/item/`,
    config
  )
}

export async function getProjectTabItem(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  projectTabItemId: ProjectTabItem['id'],
  config: Config = {}
) {
  return await useAPI<PaginationResult<ProjectTabItem>>(
    `project/${projectId}/tab/${projectTabId}/item/${projectTabItemId}/`,
    config
  )
}

export async function createProjectTabItem(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  body: ProjectTabItemForm,
  config: Config = {}
) {
  return await useAPI<ProjectTabItem>(`project/${projectId}/tab/${projectTabId}/item/`, {
    method: 'POST',
    body,
    ...config,
  })
}

export async function updateProjectTabItem(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  projectTabItemId: ProjectTabItem['id'],
  body: ProjectTabItemForm,
  config: Config = {}
) {
  return await useAPI<ProjectTabItem>(
    `project/${projectId}/tab/${projectTabId}/item/${projectTabItemId}/`,
    {
      method: 'PATCH',
      body,
      ...config,
    }
  )
}

export async function deleteProjectTabItem(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  projectTabItemId: ProjectTabItem['id'],
  config: Config = {}
) {
  return await useAPI<undefined>(
    `project/${projectId}/tab/${projectTabId}/item/${projectTabItemId}/`,
    {
      method: 'DELETE',
      ...config,
    }
  )
}

export async function createProjectTabImage(
  projectId: ProjectSlugOrId,
  body: FormData,
  config: Config = {}
) {
  return await useAPI<ImageModelCreated>(`project/${projectId}/tab-image/`, {
    method: 'POST',
    body,
    ...config,
  })
}

export async function createProjectTabItemImage(
  projectId: ProjectSlugOrId,
  projectTabId: ProjectTab['id'],
  body: FormData,
  config: Config = {}
) {
  return await useAPI<ImageModelCreated>(`project/${projectId}/tab/${projectTabId}/item-image/`, {
    method: 'POST',
    body,
    ...config,
  })
}

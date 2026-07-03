import type { ProjectTab, ProjectTabItem } from '../models/projects-tabs.model'
import type { ProjectSlugOrId } from '../models/project.model'
import type { BlogEntryId } from '../models/blog-entry.model'
import type { GoalModel } from '../models/goal.model'

interface ProviderParamsContentType<T extends string> {
  type: T
}

interface ProjectParams extends ProviderParamsContentType<'project-description'> {
  projectId: ProjectSlugOrId
}

interface ProjectTabParams extends ProviderParamsContentType<'project-tab'> {
  projectId: ProjectSlugOrId
  tabId: ProjectTab['id']
}

interface ProjectTabItemParams extends ProviderParamsContentType<'project-tab-item'> {
  projectId: ProjectSlugOrId
  tabId: ProjectTab['id']
  tabItemId: ProjectTabItem['id']
}

interface ProjectBlogParams extends ProviderParamsContentType<'project-blog'> {
  projectId: ProjectSlugOrId
  blogId: BlogEntryId
}

interface ProjectGoalParams extends ProviderParamsContentType<'project-goal'> {
  projectId: ProjectSlugOrId
  goalId: GoalModel['id']
}

type ProviderParamsChoices =
  | ProjectParams
  | ProjectTabParams
  | ProjectTabItemParams
  | ProjectBlogParams
  | ProjectGoalParams

export type ProviderParams = {
  organizationId: string | number
} & ProviderParamsChoices

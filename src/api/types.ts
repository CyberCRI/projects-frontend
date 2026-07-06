import type { LanguageType, ProjectMemberRoleType, ProjectModel } from 'shared-projects-frontend'

export interface APIParams {
  limit?: number // Number of results to return per page.
  offset?: number // The initial index from which to return the results.
  organizations?: number[]
  search?: string
  order_by?: string
  ordering?: string
}

export interface APIResponseList<T> {
  count: number // Total items
  next: string // Url to get next result
  previous: string // Url to get previous result
  results: T[] // Items
}

export interface SearchParams extends APIParams {
  category?: number // id
  languages?: LanguageType[]
  member_role?: ProjectMemberRoleType[]
  members?: string[]
  ordering?: keyof ProjectModel // Field name to order by
  organizations?: number[]
  sdgs?: number[]
  tags?: string[]
  types?: string
}

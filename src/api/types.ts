import { LanguageType, ProjectMemberRoleType } from '@/models/types'
import { ProjectModel } from '@/models/project.model'

export interface APIParams {
    limit?: Number // Number of results to return per page.
    offset?: Number // The initial index from which to return the results.
    organizations?: number[]
}

export interface APIResponseList<T> {
    count: Number // Total items
    next: String // Url to get next result
    previous: String // Url to get previous result
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

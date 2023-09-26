import BaseModel from '@/models/base.model'
import { ProjectMemberRoleType } from '@/models/types'

/**
 * @name ProjectMemberModel
 * @description Member of a project
 */
export interface ProjectMemberModel extends BaseModel {
    project: string
    user: {
        id: number
        keycloak_id: string
        people_id: string
    }
    group: ProjectMemberRoleType
}

export interface ProjectTeamModel extends BaseModel {
    reviewers: ProjectMemberModel[]
    members: ProjectMemberModel[]
    owners: ProjectMemberModel[]
    people_groups: ProjectMemberPeopleGroupOutput[]
}

export type ProjectMembersAddEntry = {
    user: string // keycloak id
    name: ProjectMemberRoleType
}

export type ProjectMembersAddInput = {
    members?: ProjectMembersAddEntry[]
    owners?: ProjectMembersAddEntry[]
    reviewers?: ProjectMembersAddEntry[]
    member_people_groups?: number[]
}

export type ProjectMembersDeleteInput = {
    name?: string
    user?: string // keycloak id
    member_people_group?: string
}

export type ProjectMemberPeopleGroupOutput = {
    id: number
    description: string
    name: string
}

export type ProjectTeamOutput = {
    members: ProjectMemberOutput[]
    owners: ProjectMemberOutput[]
    reviewers: ProjectMemberOutput[]
    people_groups: ProjectMemberPeopleGroupOutput[]
}

export type ProjectMemberOutput = Required<ProjectMemberModel>

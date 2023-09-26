import BaseModel from '@/models/base.model'

/**
 * @name OrganizationTagModel
 * @description Tag of an organization or project or project-category
 */
export interface OrganizationTagModel extends BaseModel {
    name: string
    organization: string
}

export type OrganizationTagCreateInput = Required<OrganizationTagModel>

export type OrganizationTagPutInput = Required<OrganizationTagModel>

export type OrganizationTagPatchInput = Partial<OrganizationTagModel>

export type OrganizationTagOutput = Required<OrganizationTagModel>

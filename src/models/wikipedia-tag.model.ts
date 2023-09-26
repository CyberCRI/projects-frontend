import BaseModel from '@/models/base.model'
import { APIParams } from '@/api/types'

/**
 * @name WikipediaTagModel
 * @description Tag of an organization or project or project-category
 */
export interface WikipediaTagModel extends BaseModel {
    name: string
    name_fr: string
    name_en: string
    wikipedia_qid: string
}

export interface TagParams extends APIParams {
    organization?: number
    project?: number
    search?: string
}

export interface GetWikiTagSuccessfulResponse {
    results: any[]
}

export interface GetWikiTagErrorResponse {
    status: 'ERROR'
    reason: string
    message?: string
}

export type GetWikiTagResponse = GetWikiTagSuccessfulResponse | GetWikiTagErrorResponse

export type WikipediaTagCreateInput = Required<WikipediaTagModel>

export type WikipediaTagPutInput = Required<WikipediaTagModel>

export type WikipediaTagPatchInput = Partial<WikipediaTagModel>

export type WikipediaTagOutput = Required<WikipediaTagModel>

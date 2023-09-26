import BaseModel from '@/models/base.model'

/**
 * @name FaqModel
 * @description Faq of an organization
 */
export interface FaqModel extends BaseModel {
    id: number
    title: string
    content: string
    images: FaqImageModel[]
}

export interface FaqImageModel {
    file: string
    name: string
    gallery: string
}

export type FaqOutput = BaseModel &
    Required<FaqModel> & {
        images?: Array<FaqImageModel>
    }

export type FaqInput = Required<FaqModel> & {
    organization_code: string
}

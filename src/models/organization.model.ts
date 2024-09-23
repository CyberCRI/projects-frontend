import BaseModel from '@/models/base.model'
import { FaqModel } from '@/models/faq.model'
import { LanguageType } from '@/models/types'
import { OrganizationDirectoryModel } from '@/models/organization-directory.model'
import { WikipediaTagModel } from '@/models/wikipedia-tag.model'
import { OrganizationTagModel } from './organization-tag.model'

/**
 * @name OrganizationModel
 * @description Organization
 */

interface LogoImage {
    name: string
    url: string
    variations: {
        full: string
        large: string
        medium: string
        original: string
        small: string
    }
}

export interface OrganizationModel extends BaseModel {
    background_color: string
    banner_image: string
    code: string
    contact_email: string
    dashboard_title: string
    dashboard_subtitle: string
    language: LanguageType
    logo_image: LogoImage
    main_org_logo_visibility: boolean
    is_logo_visible_on_parent_dashboard: boolean
    name: string
    wikipedia_concepts: string[]
    website_url: string
    faq: FaqModel
    wikipedia_tags: WikipediaTagModel[]
    tags: OrganizationTagModel[]
    children: string[]
}

export type OrganizationPatchInput = Partial<OrganizationModel> & {
    wikipedia_tags_ids?: string[]
    tags_ids?: number[]
}

export type OrganizationOutput = BaseModel &
    Required<OrganizationModel> & {
        faq: FaqModel
        organization_directory: OrganizationDirectoryModel
        wikipedia_tags: WikipediaTagModel[]
        tags: OrganizationTagModel[]
        children: string[]
        access_request_enabled?: boolean
    }

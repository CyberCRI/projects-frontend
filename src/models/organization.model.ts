import BaseModel from '@/models/base.model'
import { FaqModel } from '@/models/faq.model'
import { LanguageType } from '@/models/types'
import { OrganizationDirectoryModel } from '@/models/organization-directory.model'
import { TagModel } from './tag.model'
import { Translated } from '@/interfaces/translated'

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

export interface TermsAndConditions {
  id: number
  version: number
  content: string
  displayed_version: number
  displayed_content: string
}

export type OrganizationModel = BaseModel & {
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
  website_url: string
  faq: FaqModel
  children: string[]
  enabled_projects_tag_classifications: object[] // TODO: define this type
  enabled_skills_tag_classifications: object[] // TODO: define this type
  terms_and_conditions: TermsAndConditions | null
  description: string
  chat_button_text: string
  auto_translate_content: boolean
}

export type OrganizationPatchInput = Partial<OrganizationModel> & {
  tags?: number[]
}

export type OrganizationOutput = BaseModel &
  Required<OrganizationModel> & {
    faq: FaqModel
    organization_directory: OrganizationDirectoryModel
    tags: TagModel[]
    children: string[]
    access_request_enabled?: boolean
    languages?: string[]
  }

export type TranslatedOrganizationModel = Translated<
  OrganizationOutput,
  'name' | 'dashboard_title' | 'dashboard_subtitle' | 'description' | 'chat_button_text'
>

import type { OrganizationDirectoryModel } from '~/models/organization-directory.model'
import type { ImageModel } from '~/models/image.model'
import type { FaqModel } from '~/models/faq.model'
import type { LanguageType } from '~/models/types'
import type BaseModel from '~/models/base.model'

import type { Translated } from '~/interfaces/translated'

import type { SkillModel } from '~/models/skill.model'
import type { TagModel } from './tag.model'

export interface TermsAndConditions {
  id: number
  version: number
  content: string
  displayed_version: number
  displayed_content: string
  displayed_updated_at: string
}

export interface OrganizationModel extends BaseModel {
  id: number
  background_color: string
  banner_image: ImageModel
  code: string
  contact_email: string
  dashboard_title: string
  dashboard_subtitle: string
  language: LanguageType
  languages: LanguageType[]
  logo_image: ImageModel
  main_org_logo_visibility: boolean
  is_logo_visible_on_parent_dashboard: boolean
  name: string
  website_url: string
  faq: FaqModel
  children: string[]
  enabled_projects_tag_classifications: any[] // TODO: define this type
  enabled_skills_tag_classifications: any[] // TODO: define this type
  terms_and_conditions: TermsAndConditions | null
  description: string
  chat_button_text: string
  auto_translate_content: boolean
  onboarding_enabled: boolean
  chat_url?: string
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
    default_skills_tags?: SkillModel[]
    default_projects_tags?: TagModel[]
  }

export type TranslatedOrganizationModel = Translated<
  OrganizationOutput,
  'name' | 'dashboard_title' | 'dashboard_subtitle' | 'description' | 'chat_button_text'
>

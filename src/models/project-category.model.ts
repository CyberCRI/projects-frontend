import type { TemplateModel, TranslatedTemplate } from '@/models/template.model'
import type { OrganizationModel } from '@/models/organization.model'
import type { ImageSizeConverted } from '~/functs/imageSizesUtils'
import type { TagModel, TranslatedTag } from '@/models/tag.model'
import type { Translated } from '@/interfaces/translated'
import type { ImageModel } from '@/models/image.model'
import type BaseModel from '@/models/base.model'

/**
 * @name ProjectCategoryModel
 * @description Category of an organization or project
 */
export interface ProjectCategoryModel extends BaseModel {
  id: number

  name: string
  slug: string
  outdated_slugs?: string[]
  description: string

  background_image: ImageModel | null

  organization: OrganizationModel | OrganizationModel['code']

  is_reviewable: boolean
  order_index: number
  tags: TagModel[]

  only_reviewer_can_publish: boolean
  is_root: boolean
  parent: ProjectCategoryModel | null

  background_color: string
  foreground_color: string

  // extra
  children?: ProjectCategoryModel[]

  projects_count?: number

  hierarchy?: ProjectCategoryModel[]

  templates: TemplateModel[]
}

export type TranslatedProjectCategory = Translated<
  ProjectCategoryModel,
  'name' | 'description' | 'hierarchy' | 'templates'
> & {
  hierarchy?: TranslatedProjectCategory[]
  children?: TranslatedProjectCategory[]
  templates?: TranslatedTemplate[]
  tags?: TranslatedTag[]
}

export type ProjectCategoryCreateInput = Required<Omit<ProjectCategoryModel, 'tags'>> & {
  organization_code: string
  tags?: number[]
}

export type ProjectCategoryPutInput = Required<Omit<ProjectCategoryModel, 'tags'>> & {
  tags: number[]
}

export type ProjectCategoryPatchInput = Partial<Omit<ProjectCategoryModel, 'tags'>> & {
  tags?: number[]
}

export type ProjectCategoryOutput = BaseModel &
  Required<Omit<ProjectCategoryModel, 'tags'>> & {
    template: TemplateModel
    organization: OrganizationModel['code']
    tags: TagModel[]
  }

export type ProjectCategoryForm = Omit<ProjectCategoryModel, 'parent'> & {
  parent: number
  imageSizes?: ImageSizeConverted
}

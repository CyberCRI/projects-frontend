import type { LanguageType } from '~/models/types'
import type BaseModel from '~/models/base.model'

/**
 * @name OrganizationDirectoryModel
 * @description Organization directory
 */
export interface OrganizationDirectoryModel extends BaseModel {
  name: string
  description: string
  logo: string
  language: LanguageType
}

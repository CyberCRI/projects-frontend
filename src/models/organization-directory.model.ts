import BaseModel from '@/models/base.model'
import { LanguageType } from '@/models/types'

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

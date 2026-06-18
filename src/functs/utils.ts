import type { OrganizationModel } from '~/models/organization.model'

import { DEFAULT_ORGANIZATION_CODE } from '~/functs/constants'

export const isDefaultPortal = (organizationCode?: OrganizationModel['code']): boolean => {
  return (organizationCode ?? useOrganizationCode()) === DEFAULT_ORGANIZATION_CODE
}

export const removePrefix = (url: string): string => {
  const prefix = /^https?:\/\//i
  // remove any prefix
  url = url.replace(prefix, '')

  return url
}

export const isEmpty = (obj: object): boolean => Object.keys(obj).length === 0

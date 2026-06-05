import type { OrganizationModel } from '~/models/organization.model'

import { DEFAULT_ORGANIZATION_CODE } from '~/functs/constants'

export const isDefaultPortal = (organizationCode?: OrganizationModel['code']): boolean => {
  return (organizationCode ?? useOrganizationCode()) === DEFAULT_ORGANIZATION_CODE
}

export const getOrgsFromRoles = (roles: string[] = []): string[] => {
  // Filter roles that only contains an org e.g: '/ClientsAdmin' => ko, '/projects/organizations/CRI/administrators' => ok
  const rolesWithOrg = roles.filter((role) => role.split('/').length >= 4)

  // Map org and remove duplicate
  return [...new Set(rolesWithOrg.map((role) => role.split('/')[3]))]
}

export const removePrefix = (url: string): string => {
  const prefix = /^https?:\/\//i
  // remove any prefix
  url = url.replace(prefix, '')

  return url
}

export const isEmpty = (obj: object): boolean => Object.keys(obj).length === 0

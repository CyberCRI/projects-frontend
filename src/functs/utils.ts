import type { OrganizationModel } from 'shared-projects-frontend/models'
import { isReactive, isReadonly, toRaw } from 'vue'

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

export const deepToRaw = (value: any, seen = new WeakMap()) => {
  if (
    typeof value !== 'object' ||
    value === null ||
    value instanceof Blob ||
    value instanceof File
  ) {
    return value
  }

  const raw = isReactive(value) || isReadonly(value) ? toRaw(value) : value

  if (seen.has(raw)) {
    return seen.get(raw)
  }

  if (Array.isArray(raw)) {
    const result = []
    seen.set(raw, result)

    for (const item of raw) {
      result.push(deepToRaw(item, seen))
    }

    return result
  }

  const result = {}
  seen.set(raw, result)

  for (const [key, val] of Object.entries(raw)) {
    result[key] = deepToRaw(val, seen)
  }

  return result
}

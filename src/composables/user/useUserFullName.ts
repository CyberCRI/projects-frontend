import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { capitalize } from '~/functs/string'

/**
 * generate user fullName
 *
 * @function
 * @name useUserFullName
 * @kind variable
 * @param {globalThis.ComputedRef<TranslatedUserModel>} user
 * @returns {globalThis.ComputedRef<string>}
 * @exports
 */
export const useUserFullName = (user: ComputedRef<TranslatedUserModel | null>) => {
  const userFullName = computed(() => {
    const userRaw = unref(user)
    if (!userRaw) {
      return ''
    }

    return `${capitalize(userRaw.given_name)} ${capitalize(userRaw.family_name)}`.trim()
  })
  return userFullName
}

import type { Roles } from '~/models/types'

export function roleIndex(user) {
  const index = user.roles?.reduce((acc, roleString) => {
    const [scope, pk, role] = roleString.split(':')
    acc[scope] = acc[scope] || {}
    acc[scope][role] = acc[scope][role] || {}
    acc[scope][role][pk] = true
  })

  return {
    hasRole: function (scope, role, pk) {
      let res = index[scope] || {}
      res = res[role] || {}
      res = res['#' + pk] || false
      return res
    },
  }
}

/**
 * return translaged name from role
 *
 * @function
 * @name roleI18n
 * @kind variable
 * @param {Roles} role
 * @param {any[]} ...args
 * @returns {string}
 * @exports
 */
export const roleI18n = (role: Roles, ...args: any[]): string => {
  const { t } = useNuxtI18n()

  const key = `role.${role}.label`
  const result = t(key, args)
  if (result === key) {
    console.error(`invalid role translated '${role}'`)
    return role
  }
  return result
}

/**
 * return translated role info
 *
 * @function
 * @name roleHelpI18n
 * @kind variable
 * @param {Roles} role
 * @param {any[]} ...args
 * @returns {string}
 * @exports
 */
export const roleHelpI18n = (role: Roles, ...args: any[]): string => {
  const { t } = useNuxtI18n()

  const key = `role.${role}.help`
  const result = t(key, args)
  if (result === key) {
    return ''
  }
  return result
}

export const getOrgsFromRoles = (roles: string[] = []): string[] => {
  // Filter roles that only contains an org e.g: '/ClientsAdmin' => ko, '/projects/organizations/CRI/administrators' => ok
  const rolesWithOrg = roles.filter((role) => role.split('/').length >= 4)

  // Map org and remove duplicate
  return [...new Set(rolesWithOrg.map((role) => role.split('/')[3]))]
}

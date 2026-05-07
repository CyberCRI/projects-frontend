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

export const roleI18n = (role: Roles, ...args: any[]): string => {
  const { t } = useNuxtI18n()

  const key = `role.${role}.label`
  const result = t(key, args)
  console.log(role, key, result)
  if (result === key) {
    return ''
  }
  return result
}

export const roleHelpI18n = (role: Roles, ...args: any[]): string => {
  const { t } = useNuxtI18n()

  const key = `role.${role}.help`
  const result = t(key, args)
  if (result === key) {
    return ''
  }
  return result
}

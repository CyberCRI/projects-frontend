// project members can  be group or user

import { UserModel } from '@/models/user.model'

// group have a members_count attribute, user don't
export const isNotGroup = (groupOrUser) => groupOrUser.members_count === undefined

export const isGroup = (groupOrUser) => !isNotGroup(groupOrUser)

/**
 * check if user is anonymous
 *
 * @function
 * @name isAnonymousUser
 * @kind variable
 * @param {UserModel} user
 * @returns {boolean}
 * @exports
 */
export const isAnonymousUser = (user: UserModel) => {
  // TODO(remi): return boolean from backend for annonymous user
  return !user.id || (user.given_name === 'Anonymous' && user.family_name === 'User')
}

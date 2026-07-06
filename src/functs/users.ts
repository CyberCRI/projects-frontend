// project members can  be group or user
import type { UserModel } from 'shared-projects-frontend'

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

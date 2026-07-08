import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

import { canEditUser as globalCanEditUser } from 'shared-projects-frontend/lib'
import type { UserModel } from 'shared-projects-frontend/models'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for user
 *
 * @function
 * @name usePermissionUser
 * @kind variable
 * @param {RefOrRaw<number>} userId
 * @returns {{ canCreateUser: globalThis.ComputedRef<boolean>; canEditUser: globalThis.ComputedRef<boolean>; canDeleteUser: globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissionUser = (userId: RefOrRaw<UserModel['id'] | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalUserId = computed(() => unref(userId))

  const permissions = computed(() => internalUserId.value && userStore.isConnected)

  const canEditUser = computed(() => {
    return (
      permissions.value &&
      globalCanEditUser(userStore.rights, organizationStore.current.id, internalUserId.value)
    )
  })

  return {
    canEditUser,
  }
}

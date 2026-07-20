import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

import { canEditUser as globalCanEditUser } from 'shared-projects-frontend/lib'
import type { UserSlugOrId } from 'shared-projects-frontend/models'
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
export const usePermissionUser = (userId: RefOrRaw<UserSlugOrId | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalUserId = computed(() => unref(userId))

  const permissions = computed(() => internalUserId.value && userStore.isConnected)
  const isSelf = computed(() => userStore.id === internalUserId.value)

  const canEditUser = computed(() => {
    return (
      permissions.value &&
      // @ts-expect-error internalUserId is number or string
      (globalCanEditUser(userStore.rights, organizationStore.current.id, internalUserId.value) ||
        isSelf.value)
    )
  })

  return {
    canEditUser,
  }
}

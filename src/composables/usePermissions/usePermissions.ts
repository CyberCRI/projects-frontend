import useOrganizationsStore from '~/stores/useOrganizations'

import {
  isSuperAdmin as globalIsSuperAdmin,
  isFacilitator as globalIsFacilitator,
  isViewer as globalIsViewer,
  isAdmin as globalIsAdmin,
  isAdminOrFacilitator as globalIsAdminOrFacilitator,
} from 'shared-projects-frontend'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for user
 *
 * @function
 * @name usePermissionUser
 * @kind variable
 * @param {RefOrRaw<number>} userId
 * @returns {{ canCreateUser as globalThis.ComputedRef<boolean>; canEditUser as globalThis.ComputedRef<boolean>; canDeleteUser as globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissions = () => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const isSuperAdmin = computed(() => userStore.isConnected && globalIsSuperAdmin(userStore.rights))
  const isFacilitator = computed(
    () =>
      userStore.isConnected && globalIsFacilitator(userStore.rights, organizationStore.current?.id)
  )
  const isViewer = computed(
    () => userStore.isConnected && globalIsViewer(userStore.rights, organizationStore.current?.id)
  )
  const isAdmin = computed(
    () => userStore.isConnected && globalIsAdmin(userStore.rights, organizationStore.current?.id)
  )
  const isAdminOrFacilitator = computed(
    () =>
      userStore.isConnected &&
      globalIsAdminOrFacilitator(userStore.rights, organizationStore.current?.id)
  )

  return {
    isSuperAdmin,
    isFacilitator,
    isViewer,
    isAdmin,
    isAdminOrFacilitator,
  }
}

import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

import {
  canEditGroup as globalCanEditGroup,
  canCreateGroup as globalCanCreateGroup,
} from 'shared-projects-frontend/lib'
import type { PeopleGroupModel } from 'shared-projects-frontend/models'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for group
 *
 * @function
 * @name usePermissionGroup
 * @kind variable
 * @param {RefOrRaw<number>} GroupId
 * @returns {{ canEditGroup: globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissionGroup = (groupId: RefOrRaw<PeopleGroupModel['id'] | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalGroupId = computed(() => unref(groupId))

  const permissions = computed(() => internalGroupId.value && userStore.isConnected)

  const canEditGroup = computed(() => {
    return (
      permissions.value &&
      globalCanEditGroup(userStore.rights, organizationStore.current.id, internalGroupId.value)
    )
  })

  const canCreateGroup = computed(
    () =>
      userStore.isConnected && globalCanCreateGroup(userStore.rights, organizationStore.current.id)
  )

  return {
    canEditGroup,
    canCreateGroup,
  }
}

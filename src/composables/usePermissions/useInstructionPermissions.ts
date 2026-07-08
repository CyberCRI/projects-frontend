import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

import {
  canCreateInstruction as globalCanCreateInstruction,
  canEditInstruction as globalCanEditInstruction,
  canDeleteInstruction as globalCanDeleteInstruction,
} from 'shared-projects-frontend/lib'
import type { InstructionModel } from 'shared-projects-frontend/models'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for instruction
 *
 * @function
 * @name usePermissionInstruction
 * @kind variable
 * @param {RefOrRaw<number>} instructionId
 * @returns {{ canCreateInstruction: globalThis.ComputedRef<boolean>; canEditInstruction: globalThis.ComputedRef<boolean>; canDeleteInstruction: globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissionInstruction = (
  instructionId: RefOrRaw<InstructionModel['id'] | null>
) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalInstructionId = computed(() => unref(instructionId))

  const permissions = computed(() => internalInstructionId.value && userStore.isConnected)

  const canCreateInstruction = computed(() => {
    return (
      permissions.value &&
      globalCanCreateInstruction(userStore.rights, organizationStore.current.id)
    )
  })

  const canEditInstruction = computed(() => {
    return (
      permissions.value &&
      globalCanEditInstruction(
        userStore.rights,
        organizationStore.current.id,
        internalInstructionId.value
      )
    )
  })

  const canDeleteInstruction = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteInstruction(
        userStore.rights,
        organizationStore.current.id,
        internalInstructionId.value
      )
    )
  })

  return {
    canCreateInstruction,
    canEditInstruction,
    canDeleteInstruction,
  }
}

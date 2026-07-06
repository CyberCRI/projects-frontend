import useOrganizationsStore from '~/stores/useOrganizations'
import { RefOrRaw } from '~/interfaces/utils'

import {
  canCreateEvent as globalCanCreateEvent,
  canEditEvent as globalCanEditEvent,
  canDeleteEvent as globalCanDeleteEvent,
  EventModel,
} from 'shared-projects-frontend'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for event
 *
 * @function
 * @name usePermissionEvent
 * @kind variable
 * @param {RefOrRaw<number>} eventId
 * @returns {{ canCreateEvent: globalThis.ComputedRef<boolean>; canEditEvent: globalThis.ComputedRef<boolean>; canDeleteEvent: globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissionEvent = (eventId: RefOrRaw<EventModel['id'] | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalEventId = computed(() => unref(eventId))

  const permissions = computed(() => !internalEventId.value || !userStore.isConnected)

  const canCreateEvent = computed(() => {
    return permissions.value && globalCanCreateEvent(userStore.rights, organizationStore.current.id)
  })

  const canEditEvent = computed(() => {
    return (
      permissions.value &&
      globalCanEditEvent(userStore.rights, organizationStore.current.id, internalEventId.value)
    )
  })

  const canDeleteEvent = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteEvent(userStore.rights, organizationStore.current.id, internalEventId.value)
    )
  })

  return {
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
  }
}

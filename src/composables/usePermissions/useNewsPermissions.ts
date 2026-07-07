import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

import {
  canCreateNews as globalCanCreateNews,
  canEditNews as globalCanEditNews,
  canDeleteNews as globalCanDeleteNews,
} from 'shared-projects-frontend'
import type { NewsModel } from 'shared-projects-frontend'
import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for news
 *
 * @function
 * @name usePermissionNews
 * @kind variable
 * @param {RefOrRaw<number>} newsId
 * @returns {{ canCreateNews: globalThis.ComputedRef<boolean>; canEditNews: globalThis.ComputedRef<boolean>; canDeleteNews: globalThis.ComputedRef<boolean>; }}
 * @exports
 */
export const usePermissionNews = (newsId: RefOrRaw<NewsModel['id'] | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalNewsId = computed(() => unref(newsId))

  const permissions = computed(() => internalNewsId.value && userStore.isConnected)

  const canCreateNews = computed(() => {
    return permissions.value && globalCanCreateNews(userStore.rights, organizationStore.current.id)
  })

  const canEditNews = computed(() => {
    return (
      permissions.value &&
      globalCanEditNews(userStore.rights, organizationStore.current.id, internalNewsId.value)
    )
  })

  const canDeleteNews = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteNews(userStore.rights, organizationStore.current.id, internalNewsId.value)
    )
  })

  return {
    canCreateNews,
    canEditNews,
    canDeleteNews,
  }
}

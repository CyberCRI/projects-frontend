import {
  canAddReview as globalCanAddReview,
  canCreateComment as globalCanCreateComment,
  canDeleteComment as globalCanDeleteComment,
  canDeleteProject as globalCanDeleteProject,
  canDeleteReview as globalCanDeleteReview,
  canEditComment as globalCanEditComment,
  canEditReview as globalCanEditReview,
  canCreateProject as globalCanCreateProject,
  canEditProject as globalCanEditProject,
  ProjectModel,
} from 'shared-projects-frontend'
import useOrganizationsStore from '~/stores/useOrganizations'
import { RefOrRaw } from '~/interfaces/utils'

import useUsersStore from '~/stores/useUsers'

/**
 * check permissions for project
 *
 * @function
 * @name usePermissionProject
 * @kind variable
 * @param {RefOrRaw<string>} projectId
 * @returns {{ canCreateProject: globalThis.ComputedRef<boolean>; canEditProject: globalThis.ComputedRef<boolean>; canDeleteProject: globalThis.ComputedRef<boolean>; canCreateComment: globalThis.ComputedRef<boolean>; canEditComment: globalThis.ComputedRef<boolean>; canDeleteComment: globalThis.ComputedRef<boolean>; canCreateReview: globalThis.ComputedRef<boolean>; canEditReview: globalThis.ComputedRef<boolean>; canDeleteReview: globalThis.ComputedRef<...>; }}
 * @exports
 */
export const usePermissionProject = (projectId: RefOrRaw<ProjectModel['id'] | null>) => {
  const organizationStore = useOrganizationsStore()
  const userStore = useUsersStore()

  const internalProjectId = computed(() => unref(projectId))

  const canEditProject = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanEditProject(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  const canCreateProject = computed(
    () =>
      userStore.isConnected &&
      globalCanCreateProject(userStore.rights, organizationStore.current.id)
  )

  const canDeleteProject = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanDeleteProject(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  // comments
  const canCreateComment = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanCreateComment(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  const canEditComment = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanEditComment(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  const canDeleteComment = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanDeleteComment(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  // reviews
  const canCreateReview = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanAddReview(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  const canEditReview = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanEditReview(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  const canDeleteReview = computed(() => {
    if (!internalProjectId.value || !userStore.isConnected) {
      return false
    }
    return globalCanDeleteReview(
      userStore.rights,
      organizationStore.current.id,
      internalProjectId.value
    )
  })

  return {
    canCreateProject,
    canEditProject,
    canDeleteProject,

    // comments
    canCreateComment,
    canEditComment,
    canDeleteComment,

    // reviews
    canCreateReview,
    canEditReview,
    canDeleteReview,
  }
}

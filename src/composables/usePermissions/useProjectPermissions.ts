import {
  canCreateReview as globalCanCreateReview,
  canCreateComment as globalCanCreateComment,
  canDeleteComment as globalCanDeleteComment,
  canDeleteProject as globalCanDeleteProject,
  canDeleteReview as globalCanDeleteReview,
  canEditComment as globalCanEditComment,
  canEditReview as globalCanEditReview,
  canCreateProject as globalCanCreateProject,
  canEditProject as globalCanEditProject,
  isMember as globalIsMember,
  isOwner as globalIsOwner,
  isViewer,
} from 'shared-projects-frontend/lib'
import type { ProjectModel } from 'shared-projects-frontend/models'
import useOrganizationsStore from '~/stores/useOrganizations'
import type { RefOrRaw } from '~/interfaces/utils'

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

  const permissions = computed(() => internalProjectId.value && userStore.isConnected)

  const canCreateProject = computed(() => {
    // TODO fix this permissions
    return userStore.isConnected && !isViewer(userStore.rights, organizationStore.current.id)
  })

  const canEditProject = computed(() => {
    return (
      permissions.value &&
      globalCanEditProject(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const canDeleteProject = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteProject(
        userStore.rights,
        organizationStore.current.id,
        internalProjectId.value
      )
    )
  })

  // comments
  const canCreateComment = computed(() => {
    return (
      permissions.value &&
      globalCanCreateComment(
        userStore.rights,
        organizationStore.current.id,
        internalProjectId.value
      )
    )
  })

  const canEditComment = computed(() => {
    return (
      permissions.value &&
      globalCanEditComment(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const canDeleteComment = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteComment(
        userStore.rights,
        organizationStore.current.id,
        internalProjectId.value
      )
    )
  })

  // reviews
  const canCreateReview = computed(() => {
    return (
      permissions.value &&
      globalCanCreateReview(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const canEditReview = computed(() => {
    return (
      permissions.value &&
      globalCanEditReview(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const canDeleteReview = computed(() => {
    return (
      permissions.value &&
      globalCanDeleteReview(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const isMember = computed(() => {
    return (
      permissions.value &&
      globalIsMember(userStore.rights, organizationStore.current.id, internalProjectId.value)
    )
  })

  const isOwner = computed(() => {
    return (
      permissions.value &&
      globalIsOwner(userStore.rights, organizationStore.current.id, internalProjectId.value)
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

    // members
    isMember,
    isOwner,
  }
}

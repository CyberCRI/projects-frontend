import utils from '@/functs/functions'

// import { mapState } from 'pinia'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
import { computed } from 'vue'
export default function usePermissions() {
  // const { currentPeopleGroupIdForPermissions.value } = mapState(usePeopleGroupsStore, {
  //     // unique name so it doesn(t conflict with a name in the component)
  //     currentPeopleGroupIdForPermissions.value: 'currentId',
  // })
  // const { currentOrganizationForPermissions.value } = mapState(useOrganizationsStore, {
  //     // unique name so it doesn(t conflict with a name in the component)
  //     currentOrganizationForPermissions.value: 'current',
  // })
  // const { currentProjectIdForPermissions.value } = mapState(useProjectsStore, {
  //     // unique name so it doesn(t conflict with a name in the component)
  //     currentProjectIdForPermissions.value: 'currentProjectId',
  // })
  // const { isConnectedForPermissions.value, getPermissionsForPermissions.value, getUserRolesForPermissions.value } =
  //     mapState(useUsersStore, {
  //         // unique name so it doesn(t conflict with a name in the component)
  //         isConnectedForPermissions.value: 'isConnected',
  //         getPermissionsForPermissions.value: 'permissions',
  //         getUserRolesForPermissions.value: 'roles',
  //     })

  const peopleGroupStore = usePeopleGroupsStore()
  const currentPeopleGroupIdForPermissions = computed(() => peopleGroupStore.currentId)

  const organizationStore = useOrganizationsStore()
  const currentOrganizationForPermissions = computed(() => organizationStore.current)

  const projectStore = useProjectsStore()
  const currentProjectIdForPermissions = computed(() => projectStore.currentProjectId)

  const userStore = useUsersStore()
  // unique name so it doesn't conflict with a name in the component)
  // note this is legacy of when permissions where in a mixin and can be simplified now
  const isConnectedForPermissions = computed(() => userStore.isConnected)
  const getPermissionsForPermissions = computed(() => userStore.permissions)
  const getUserRolesForPermissions = computed(() => userStore.roles)

  function hasPermission(scope, action, pk?) {
    const permissions = getPermissionsForPermissions.value
    return utils.hasPermission(permissions, scope, action, pk)
  }

  const isOwner = computed(() => {
    return (
      isConnectedForPermissions.value &&
      (hasPermission('projects', 'delete_project', currentProjectIdForPermissions.value || null) ||
        hasPermission(
          'organizations',
          'delete_project',
          currentOrganizationForPermissions.value?.id
        ) ||
        hasPermission('projects', 'delete_project'))
    )
  })

  const isSuperAdmin = computed(() => {
    return (
      isConnectedForPermissions.value &&
      getUserRolesForPermissions.value.some((role) => role === 'superadmins')
    )
  })

  const isFacilitator = computed(() => {
    const orgId = currentOrganizationForPermissions.value?.id
    return (
      isConnectedForPermissions.value &&
      getUserRolesForPermissions.value.some(
        (role) => role === `organization:#${orgId}:facilitators`
      )
    )
  })

  const isViewer = computed(() => {
    const orgId = currentOrganizationForPermissions.value?.id
    return (
      isConnectedForPermissions.value &&
      getUserRolesForPermissions.value.some((role) => role === `organization:#${orgId}:viewer`)
    )
  })

  const isOrgAdmin = computed(() => {
    const orgId = currentOrganizationForPermissions.value?.id
    return (
      isConnectedForPermissions.value &&
      getUserRolesForPermissions.value.some((role) => role === `organization:#${orgId}:admins`)
    )
  })

  const isAdmin = computed(() => {
    return (
      (isConnectedForPermissions.value && hasPermission('organizations', 'destroy')) ||
      isSuperAdmin.value ||
      isOrgAdmin.value
    )
  })

  const isOrgUser = computed(() => {
    const orgId = currentOrganizationForPermissions.value?.id
    return (
      isConnectedForPermissions.value &&
      getUserRolesForPermissions.value.some((role) => role === `organization:#${orgId}:users`)
    )
  })

  const isAdminOrFacilitator = computed(() => {
    return isAdmin.value || isFacilitator.value
  })

  /* PROJECTS */

  const canCreateProject = computed(() => {
    return isConnectedForPermissions.value && !isViewer.value
  })

  const canEditProject = computed(() => {
    return (
      hasPermission('projects', 'change_project', currentProjectIdForPermissions.value || null) ||
      hasPermission(
        'organizations',
        'change_project',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('projects', 'change_project') ||
      isAdmin.value
    )
  })

  const canDestroyProject = computed(() => {
    return (
      hasPermission('projects', 'delete_project', currentProjectIdForPermissions.value || null) ||
      hasPermission(
        'organizations',
        'delete_project',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('projects', 'delete_project') ||
      isAdmin.value
    )
  })

  /* REVIEW */
  const canAddReview = computed(() => {
    return (
      hasPermission('projects', 'add_review', currentProjectIdForPermissions.value || null) ||
      hasPermission('organization', 'add_review', currentOrganizationForPermissions.value?.id) ||
      hasPermission('organization', 'add_review') ||
      hasPermission('projects', 'add_review') ||
      isAdmin.value
    )
  })

  const canEditReview = computed(() => {
    return (
      hasPermission('projects', 'change_review', currentProjectIdForPermissions.value || null) ||
      hasPermission('organization', 'change_review', currentOrganizationForPermissions.value?.id) ||
      hasPermission('organization', 'change_review') ||
      hasPermission('projects', 'change_review') ||
      isAdmin.value
    )
  })

  const canDestroyReview = computed(() => {
    return (
      hasPermission('projects', 'delete_review', currentProjectIdForPermissions.value || null) ||
      hasPermission('organization', 'delete_review', currentOrganizationForPermissions.value?.id) ||
      hasPermission('organization', 'delete_review') ||
      hasPermission('projects', 'delete_review') ||
      isAdmin.value
    )
  })

  /* USER */
  // TODO: fix this
  const canEditUser = computed(() => {
    return (
      hasPermission(
        'organizations',
        'member',
        // null,
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('organizations', 'member', 'projects') ||
      hasPermission(
        'organizations',
        'member',
        //'projects',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission(
        'projects',
        'member',
        // null,
        currentProjectIdForPermissions.value
      ) ||
      hasPermission(
        'organizations',
        // 'update',
        'member',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('organizations', 'member') ||
      hasPermission('project-member', 'update') ||
      hasPermission('projects', 'member') ||
      isAdmin.value
    )
  })

  /* COMMENTS */
  const canCreateComments = computed(() => {
    // rights are not complete for this (to lighten payload)
    // so for now assume that if the user is connected and can see the project
    // s.he can comment
    // TODO: rethink this with backend and P.O.
    return isConnectedForPermissions.value

    // this.hasPermission(
    //     'projects',
    //     'add_comment',
    //     this.currentProjectIdForPermissions.value
    // ) ||
    // this.hasPermission(
    //     'organizations',
    //     'add_comment',
    //     this.currentOrganizationForPermissions.value?.id
    // ) ||
    // this.hasPermission('organizations', 'add_comment') ||
    // this.hasPermission('projects', 'add_comment') ||
    // this.isAdmin
  })

  const canEditComment = computed(() => {
    return (
      hasPermission('projects', 'change_comment', currentProjectIdForPermissions.value) ||
      hasPermission(
        'organizations',
        'change_comment',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('organizations', 'change_comment') ||
      hasPermission('projects', 'change_comment') ||
      isAdmin.value
    )
  })

  const canDeleteComment = computed(() => {
    return (
      hasPermission('projects', 'delete_comment', currentProjectIdForPermissions.value) ||
      hasPermission(
        'organizations',
        'delete_comment',
        currentOrganizationForPermissions.value?.id
      ) ||
      hasPermission('organizations', 'delete_comment') ||
      hasPermission('projects', 'delete_comment') ||
      isAdmin.value
    )
  })

  /* PEOPLE-GROUPS */
  const canCreateGroup = computed(() => {
    return (
      hasPermission('organizations', 'add_peoplegroup', currentPeopleGroupIdForPermissions.value) ||
      hasPermission('organizations', 'add_peoplegroup') ||
      hasPermission('peoplegroup', 'add_peoplegroup') ||
      isAdmin.value
    )
  })

  const canEditGroup = computed(() => {
    return (
      isAdmin.value ||
      hasPermission(
        'accounts',
        'change_peoplegroup',
        currentPeopleGroupIdForPermissions.value || null
      ) ||
      hasPermission(
        'organizations',
        'change_peoplegroup',
        currentPeopleGroupIdForPermissions.value || null
      ) ||
      hasPermission('organizations', 'change_peoplegroup') ||
      hasPermission('peoplegroup', 'update')
    )
  })

  /* NEWS */

  const canCreateNews = computed(() => {
    return isAdminOrFacilitator.value
  })
  const canEditNews = computed(() => {
    return isAdminOrFacilitator.value
  })
  const canDeleteNews = computed(() => {
    return isAdminOrFacilitator.value
  })

  /* EVENTS */

  const canCreateEvent = computed(() => {
    return isAdminOrFacilitator.value
  })
  const canEditEvent = computed(() => {
    return isAdminOrFacilitator.value
  })
  const canDeleteEvent = computed(() => {
    return isAdminOrFacilitator.value
  })

  /* INSTRUCTIONS */

  const canCreateInstruction = computed(() => {
    return isAdminOrFacilitator.value
  })

  const canEditInstruction = computed(() => {
    return isAdminOrFacilitator.value
  })
  const canDeleteInstruction = computed(() => {
    return isAdminOrFacilitator.value
  })

  return {
    hasPermission,

    currentPeopleGroupIdForPermissions,

    currentOrganizationForPermissions,

    currentProjectIdForPermissions,

    isConnectedForPermissions,
    getPermissionsForPermissions,
    getUserRolesForPermissions,

    isOwner,

    isSuperAdmin,

    isFacilitator,

    isViewer,

    isOrgAdmin,

    isAdmin,

    isOrgUser,

    isAdminOrFacilitator,

    /* PROJECTS */

    canCreateProject,

    canEditProject,

    canDestroyProject,

    /* REVIEW */
    canAddReview,

    canEditReview,

    canDestroyReview,

    /* USER */
    canEditUser,

    /* COMMENTS */
    canCreateComments,

    canEditComment,

    canDeleteComment,

    /* PEOPLE-GROUPS */
    canCreateGroup,

    canEditGroup,

    /* NEWS */

    canCreateNews,
    canEditNews,
    canDeleteNews,

    /* EVENTS */

    canCreateEvent,
    canEditEvent,
    canDeleteEvent,

    /* INSTRUCTIONS */

    canCreateInstruction,
    canEditInstruction,
    canDeleteInstruction,
  }
}

/* eslint-disable vue/no-unused-properties */
/* eslint-disable vue/require-name-property */

import utils from '@/functs/functions'

// import { mapState } from 'pinia'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
import { computed } from 'vue'
export default function usePermissions() {
    // const { currentPeopleGroupIdForPermissions } = mapState(usePeopleGroupsStore, {
    //     // unique name so it doesn(t conflict with a name in the component)
    //     currentPeopleGroupIdForPermissions: 'currentId',
    // })
    // const { currentOrganizationForPermissions } = mapState(useOrganizationsStore, {
    //     // unique name so it doesn(t conflict with a name in the component)
    //     currentOrganizationForPermissions: 'current',
    // })
    // const { currentProjectIdForPermissions } = mapState(useProjectsStore, {
    //     // unique name so it doesn(t conflict with a name in the component)
    //     currentProjectIdForPermissions: 'currentProjectId',
    // })
    // const { isConnectedForPermissions, getPermissionsForPermissions, getUserRolesForPermissions } =
    //     mapState(useUsersStore, {
    //         // unique name so it doesn(t conflict with a name in the component)
    //         isConnectedForPermissions: 'isConnected',
    //         getPermissionsForPermissions: 'permissions',
    //         getUserRolesForPermissions: 'roles',
    //     })

    const peopleGroupStore = usePeopleGroupsStore()
    const currentPeopleGroupIdForPermissions = peopleGroupStore.currentId

    const organizationStore = useOrganizationsStore()

    const currentOrganizationForPermissions = organizationStore.current

    const projectStore = useProjectsStore()

    const currentProjectIdForPermissions = projectStore.currentProjectId

    const userStore = useUsersStore()
    // unique name so it doesn(t conflict with a name in the component)
    const isConnectedForPermissions = userStore.isConnected
    const getPermissionsForPermissions = userStore.permissions
    const getUserRolesForPermissions = userStore.roles

    function hasPermission(scope, action, pk?) {
        const permissions = getPermissionsForPermissions
        return utils.hasPermission(permissions, scope, action, pk)
    }

    const isOwner = computed(() => {
        return (
            isConnectedForPermissions &&
            (hasPermission('projects', 'delete_project', currentProjectIdForPermissions || null) ||
                hasPermission(
                    'organizations',
                    'delete_project',
                    currentOrganizationForPermissions?.id
                ) ||
                hasPermission('projects', 'delete_project'))
        )
    })

    const isSuperAdmin = computed(() => {
        return (
            isConnectedForPermissions &&
            getUserRolesForPermissions.some((role) => role === 'superadmins')
        )
    })

    const isFacilitator = computed(() => {
        const orgId = currentOrganizationForPermissions?.id
        return (
            isConnectedForPermissions &&
            getUserRolesForPermissions.some(
                (role) => role === `organization:#${orgId}:facilitators`
            )
        )
    })

    const isOrgAdmin = computed(() => {
        const orgId = currentOrganizationForPermissions?.id
        return (
            isConnectedForPermissions &&
            getUserRolesForPermissions.some((role) => role === `organization:#${orgId}:admins`)
        )
    })

    const isAdmin = computed(() => {
        return (
            (isConnectedForPermissions && hasPermission('organizations', 'destroy')) ||
            isSuperAdmin.value ||
            isOrgAdmin.value
        )
    })

    const isOrgUser = computed(() => {
        const orgId = currentOrganizationForPermissions?.id
        return (
            isConnectedForPermissions &&
            getUserRolesForPermissions.some((role) => role === `organization:#${orgId}:users`)
        )
    })

    const isAdminOrFacilitator = computed(() => {
        return isAdmin.value || isFacilitator.value
    })

    /* PROJECTS */

    const canCreateProject = computed(() => {
        return isConnectedForPermissions
    })

    const canEditProject = computed(() => {
        return (
            hasPermission('projects', 'change_project', currentProjectIdForPermissions || null) ||
            hasPermission(
                'organizations',
                'change_project',
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission('projects', 'change_project') ||
            isAdmin.value
        )
    })

    const canDestroyProject = computed(() => {
        return (
            hasPermission('projects', 'delete_project', currentProjectIdForPermissions || null) ||
            hasPermission(
                'organizations',
                'delete_project',
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission('projects', 'delete_project') ||
            isAdmin.value
        )
    })

    /* REVIEW */
    const canAddReview = computed(() => {
        return (
            hasPermission('projects', 'add_review', currentProjectIdForPermissions || null) ||
            hasPermission('organization', 'add_review', currentOrganizationForPermissions?.id) ||
            hasPermission('organization', 'add_review') ||
            hasPermission('projects', 'add_review') ||
            isAdmin.value
        )
    })

    const canEditReview = computed(() => {
        return (
            hasPermission('projects', 'change_review', currentProjectIdForPermissions || null) ||
            hasPermission('organization', 'change_review', currentOrganizationForPermissions?.id) ||
            hasPermission('organization', 'change_review') ||
            hasPermission('projects', 'change_review') ||
            isAdmin.value
        )
    })

    const canDestroyReview = computed(() => {
        return (
            hasPermission('projects', 'delete_review', currentProjectIdForPermissions || null) ||
            hasPermission('organization', 'delete_review', currentOrganizationForPermissions?.id) ||
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
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission('organizations', 'member', 'projects') ||
            hasPermission(
                'organizations',
                'member',
                //'projects',
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission(
                'projects',
                'member',
                // null,
                currentProjectIdForPermissions
            ) ||
            hasPermission(
                'organizations',
                // 'update',
                'member',
                currentOrganizationForPermissions?.id
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
        return isConnectedForPermissions

        // this.hasPermission(
        //     'projects',
        //     'add_comment',
        //     this.currentProjectIdForPermissions
        // ) ||
        // this.hasPermission(
        //     'organizations',
        //     'add_comment',
        //     this.currentOrganizationForPermissions?.id
        // ) ||
        // this.hasPermission('organizations', 'add_comment') ||
        // this.hasPermission('projects', 'add_comment') ||
        // this.isAdmin
    })

    const canEditComment = computed(() => {
        return (
            hasPermission('projects', 'change_comment', currentProjectIdForPermissions) ||
            hasPermission(
                'organizations',
                'change_comment',
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission('organizations', 'change_comment') ||
            hasPermission('projects', 'change_comment') ||
            isAdmin.value
        )
    })

    const canDeleteComment = computed(() => {
        return (
            hasPermission('projects', 'delete_comment', currentProjectIdForPermissions) ||
            hasPermission(
                'organizations',
                'delete_comment',
                currentOrganizationForPermissions?.id
            ) ||
            hasPermission('organizations', 'delete_comment') ||
            hasPermission('projects', 'delete_comment') ||
            isAdmin.value
        )
    })

    /* PEOPLE-GROUPS */
    const canCreateGroup = computed(() => {
        return (
            hasPermission('organizations', 'add_peoplegroup', currentPeopleGroupIdForPermissions) ||
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
                currentPeopleGroupIdForPermissions || null
            ) ||
            hasPermission(
                'organizations',
                'change_peoplegroup',
                currentPeopleGroupIdForPermissions || null
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

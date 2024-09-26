import utils from '@/functs/functions'

import { mapState } from 'pinia'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'

export default {
    methods: {
        hasPermission(scope, action, pk?) {
            const permissions = this.getPermissionsForPermissions
            return utils.hasPermission(permissions, scope, action, pk)
        },
    },

    computed: {
        ...mapState(usePeopleGroupsStore, {
            // unique name so it doesn(t conflict with a name in the component)
            currentPeopleGroupIdForPermissions: 'currentId',
        }),
        ...mapState(useOrganizationsStore, {
            // unique name so it doesn(t conflict with a name in the component)
            currentOrganizationForPermissions: 'current',
        }),
        ...mapState(useProjectsStore, {
            // unique name so it doesn(t conflict with a name in the component)
            currentProjectIdForPermissions: 'currentProjectId',
        }),
        ...mapState(useUsersStore, {
            // unique name so it doesn(t conflict with a name in the component)
            isConnectedForPermissions: 'isConnected',
            getPermissionsForPermissions: 'getPermissions',
            getUserRolesForPermissions: 'getUserRoles',
        }),
        isOwner() {
            return (
                this.isConnectedForPermissions &&
                (this.hasPermission(
                    'projects',
                    'delete_project',
                    this.currentProjectIdForPermissions || null
                ) ||
                    this.hasPermission(
                        'organizations',
                        'delete_project',
                        this.currentOrganizationForPermissions.id
                    ) ||
                    this.hasPermission('projects', 'delete_project'))
            )
        },

        isSuperAdmin() {
            return (
                this.isConnectedForPermissions &&
                this.getUserRolesForPermissions.some((role) => role === 'superadmins')
            )
        },

        isFacilitator() {
            const orgId = this.currentOrganizationForPermissions.id
            return (
                this.isConnectedForPermissions &&
                this.getUserRolesForPermissions.some(
                    (role) => role === `organization:#${orgId}:facilitators`
                )
            )
        },

        isOrgAdmin() {
            const orgId = this.currentOrganizationForPermissions.id
            return (
                this.isConnectedForPermissions &&
                this.getUserRolesForPermissions.some(
                    (role) => role === `organization:#${orgId}:admins`
                )
            )
        },

        isAdmin() {
            return (
                (this.isConnectedForPermissions &&
                    this.hasPermission('organizations', 'destroy')) ||
                this.isSuperAdmin ||
                this.isOrgAdmin
            )
        },

        isAdminOrFacilitator() {
            return this.isAdmin || this.isFacilitator
        },

        /* PROJECTS */

        canCreateProject() {
            return this.isConnectedForPermissions
        },

        canEditProject() {
            return (
                this.hasPermission(
                    'projects',
                    'change_project',
                    this.currentProjectIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organizations',
                    'change_project',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('projects', 'change_project') ||
                this.isAdmin
            )
        },

        canDestroyProject() {
            return (
                this.hasPermission(
                    'projects',
                    'delete_project',
                    this.currentProjectIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organizations',
                    'delete_project',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('projects', 'delete_project') ||
                this.isAdmin
            )
        },

        /* REVIEW */
        canAddReview() {
            return (
                this.hasPermission(
                    'projects',
                    'add_review',
                    this.currentProjectIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organization',
                    'add_review',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organization', 'add_review') ||
                this.hasPermission('projects', 'add_review') ||
                this.isAdmin
            )
        },

        canEditReview() {
            return (
                this.hasPermission(
                    'projects',
                    'change_review',
                    this.currentProjectIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organization',
                    'change_review',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organization', 'change_review') ||
                this.hasPermission('projects', 'change_review') ||
                this.isAdmin
            )
        },

        canDestroyReview() {
            return (
                this.hasPermission(
                    'projects',
                    'delete_review',
                    this.currentProjectIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organization',
                    'delete_review',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organization', 'delete_review') ||
                this.hasPermission('projects', 'delete_review') ||
                this.isAdmin
            )
        },

        /* USER */
        // TODO: fix this
        canEditUser() {
            return (
                this.hasPermission(
                    'organizations',
                    'member',
                    null,
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organizations', 'member', 'projects') ||
                this.hasPermission(
                    'organizations',
                    'member',
                    'projects',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission(
                    'projects',
                    'member',
                    null,
                    this.currentProjectIdForPermissions
                ) ||
                this.hasPermission(
                    'organizations',
                    'update',
                    'member',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organizations', 'member') ||
                this.hasPermission('project-member', 'update') ||
                this.hasPermission('projects', 'member') ||
                this.isAdmin
            )
        },

        /* COMMENTS */
        canCreateComments() {
            // rights are not complete for this (to lighten payload)
            // so for now assume that if the user is connected and can see the project
            // s.he can comment
            // TODO: rethink this with backend and P.O.
            return this.isConnectedForPermissions

            // this.hasPermission(
            //     'projects',
            //     'add_comment',
            //     this.currentProjectIdForPermissions
            // ) ||
            // this.hasPermission(
            //     'organizations',
            //     'add_comment',
            //     this.currentOrganizationForPermissions.id
            // ) ||
            // this.hasPermission('organizations', 'add_comment') ||
            // this.hasPermission('projects', 'add_comment') ||
            // this.isAdmin
        },

        canEditComment() {
            return (
                this.hasPermission(
                    'projects',
                    'change_comment',
                    this.currentProjectIdForPermissions
                ) ||
                this.hasPermission(
                    'organizations',
                    'change_comment',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organizations', 'change_comment') ||
                this.hasPermission('projects', 'change_comment') ||
                this.isAdmin
            )
        },

        canDeleteComment() {
            return (
                this.hasPermission(
                    'projects',
                    'delete_comment',
                    this.currentProjectIdForPermissions
                ) ||
                this.hasPermission(
                    'organizations',
                    'delete_comment',
                    this.currentOrganizationForPermissions.id
                ) ||
                this.hasPermission('organizations', 'delete_comment') ||
                this.hasPermission('projects', 'delete_comment') ||
                this.isAdmin
            )
        },

        /* PEOPLE-GROUPS */
        canCreateGroup() {
            return (
                this.hasPermission(
                    'organizations',
                    'add_peoplegroup',
                    this.currentPeopleGroupIdForPermissions
                ) ||
                this.hasPermission('organizations', 'add_peoplegroup') ||
                this.hasPermission('peoplegroup', 'add_peoplegroup') ||
                this.isAdmin
            )
        },

        canEditGroup() {
            return (
                this.isAdmin ||
                this.hasPermission(
                    'accounts',
                    'change_peoplegroup',
                    this.currentPeopleGroupIdForPermissions || null
                ) ||
                this.hasPermission(
                    'organizations',
                    'change_peoplegroup',
                    this.currentPeopleGroupIdForPermissions || null
                ) ||
                this.hasPermission('organizations', 'change_peoplegroup') ||
                this.hasPermission('peoplegroup', 'update')
            )
        },

        /* NEWS */

        canCreateNews() {
            return this.isAdminOrFacilitator
        },
        canEditNews() {
            return this.isAdminOrFacilitator
        },
        canDeleteNews() {
            return this.isAdminOrFacilitator
        },

        /* EVENTS */

        canCreateEvent() {
            return this.isAdminOrFacilitator
        },
        canEditEvent() {
            return this.isAdminOrFacilitator
        },
        canDeleteEvent() {
            return this.isAdminOrFacilitator
        },

        /* INSTRUCTIONS */

        canCreateInstruction() {
            return this.isAdminOrFacilitator
        },
        canEditInstruction() {
            return this.isAdminOrFacilitator
        },
        canDeleteInstruction() {
            return this.isAdminOrFacilitator
        },
    },
}

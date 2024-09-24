import utils from '@/functs/functions'
import store from '@/store'

import { mapState } from 'pinia'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations'

export default {
    methods: {
        hasPermission(scope, action, pk?) {
            const permissions = this.$store
                ? this.$store.getters['users/getPermissions']
                : store.getters['users/getPermissions']
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
        isOwner() {
            return (
                this.$store.getters['users/isConnected'] &&
                (this.hasPermission(
                    'projects',
                    'delete_project',
                    this.$store.getters['projects/currentProjectId'] || null
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
                this.$store.getters['users/isConnected'] &&
                this.$store.getters['users/getUserRoles'].some((role) => role === 'superadmins')
            )
        },

        isFacilitator() {
            const orgId = this.currentOrganizationForPermissions.id
            return (
                this.$store.getters['users/isConnected'] &&
                this.$store.getters['users/getUserRoles'].some(
                    (role) => role === `organization:#${orgId}:facilitators`
                )
            )
        },

        isOrgAdmin() {
            const orgId = this.currentOrganizationForPermissions.id
            return (
                this.$store.getters['users/isConnected'] &&
                this.$store.getters['users/getUserRoles'].some(
                    (role) => role === `organization:#${orgId}:admins`
                )
            )
        },

        isAdmin() {
            return (
                (this.$store.getters['users/isConnected'] &&
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
            return this.$store.getters['users/isConnected']
        },

        canEditProject() {
            return (
                this.hasPermission(
                    'projects',
                    'change_project',
                    this.$store.getters['projects/currentProjectId'] || null
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
                    this.$store.getters['projects/currentProjectId'] || null
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
                    this.$store.getters['projects/currentProjectId'] || null
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
                    this.$store.getters['projects/currentProjectId'] || null
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
                    this.$store.getters['projects/currentProjectId'] || null
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
                    this.$store.getters['projects/currentProjectId']
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
            return this.$store.getters['users/isConnected']

            // this.hasPermission(
            //     'projects',
            //     'add_comment',
            //     this.$store.getters['projects/currentProjectId']
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
                    this.$store.getters['projects/currentProjectId']
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
                    this.$store.getters['projects/currentProjectId']
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

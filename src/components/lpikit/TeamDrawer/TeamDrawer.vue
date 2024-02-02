<template>
    <DrawerLayout
        :confirm-action-name="$t('common.add')"
        :is-opened="isOpened"
        :title="$filters.capitalize(label)"
        class="team-modal large"
        @close="$emit('close')"
        @confirm="selectAction"
        :confirm-action-disabled="selectedUsers.length === 0"
        :asyncing="asyncing"
    >
        <UserSelection
            v-show="isSelectingUser && !isEditMode"
            :add-to-current-project="addToCurrentProject"
            :current-users="currentUsers"
            :project="project"
            @select-user="selectUser"
        />

        <RoleSelection
            v-if="isSelectingRoles"
            :add-to-current-project="addToCurrentProject"
            :is-edit-mode="isEditMode"
            :project="project"
            :selected-category="selectedCategory"
            :selected-role="selectedRole"
            :selected-users="selectedUsers"
            @back-to-user-selection="goBackToUserSelection"
            @select-role="selectRole"
        />
    </DrawerLayout>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import UserSelection from './UserSelection.vue'
import RoleSelection from './RoleSelection.vue'

export default {
    name: 'TeamDrawer',

    emits: ['close', 'add-user'],

    components: { DrawerLayout, UserSelection, RoleSelection },

    props: {
        addToCurrentProject: {
            type: Boolean,
            default: true,
        },

        currentUsers: {
            type: Array,
            default: () => [],
        },

        isEditMode: {
            type: Boolean,
            default: false,
        },

        editedUser: {
            type: Object,
            default: () => {},
        },

        isOpened: {
            type: Boolean,
            default: false,
        },

        selectedCategory: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            isSelectingUser: true,
            validatePick: false,
            selectedUsers: [],
            selectedRole: 'owners',
            isSelectingRoles: false,
            asyncing: false,
            form: {
                team: {
                    members: [],
                    owners: [],
                    reviewers: [],
                    people_groups: [],
                },
            },
        }
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },

        projectSlug() {
            return this.$store.getters['projects/currentProjectSlug']
        },

        label() {
            return this.isEditMode ? this.$t('team.edit') : this.$t('team.add')
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                if (this.editedUser && this.isEditMode) {
                    this.selectedUsers = [this.editedUser.user]
                    this.selectedRole = this.editedUser.role
                    this.isSelectingRoles = true
                    this.isSelectingUser = false
                } else {
                    this.selectedUsers = []
                    this.selectedRole = 'owners'
                    this.isSelectingUser = true
                }
            },
            immediate: true,
        },
    },

    methods: {
        async addTeamMember() {
            this.validatePick = true
            if (this.addToCurrentProject && !this.isSelectingUser) {
                this.asyncing = true
                try {
                    await this.$store.dispatch('projectMembers/addProjectMembers', {
                        projectId: this.project.id,
                        projectMembers: { ...this.form.team },
                    })
                    const updatedProject = await this.$store.dispatch(
                        'projects/getProject',
                        this.project.id
                    )
                    await this.$store.dispatch(
                        'projects/updateCurrentProjectMembers',
                        updatedProject
                    )

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.team-member-create.success'),
                        type: 'success',
                    })

                    if (this.$route.name !== 'projectTeam') {
                        this.$router.push({
                            name: 'projectTeam',
                            params: { slugOrId: this.projectSlug },
                        })
                    }
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.team-member-create.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.asyncing = false
                    this.$emit('close')
                }
            } else {
                this.$emit('add-user', this.selectedUsers)
                this.$emit('close')
            }
        },

        goBackToUserSelection() {
            this.isSelectingUser = true
            this.isSelectingRoles = false
        },

        selectUser(users) {
            this.selectedUsers = [...users]
        },

        selectRole(users) {
            this.selectedUsers = [...users]
        },

        selectAction() {
            let only_groups = this.selectedUsers.some((user) => user.id) ? false : true
            if (this.isSelectingRoles || only_groups) {
                this.isSelectingUser = false
                this.updateTeam()
                this.addTeamMember()
            } else this.changeMode()
        },

        changeMode() {
            this.isSelectingUser = false
            this.isSelectingRoles = true
        },

        updateTeam() {
            this.form.team.members = []
            this.form.team.owners = []
            this.form.team.reviewers = []
            this.form.team.people_groups = []

            this.selectedUsers.forEach((user) => {
                if (user.id) {
                    this.form.team[user.role].push(user.id)
                } else {
                    this.form.team.people_groups.push(user.id)
                }
            })
        },
    },
}
</script>

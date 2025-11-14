<template>
  <BaseDrawer
    :confirm-action-name="$t('common.add')"
    :is-opened="isOpened"
    :title="label"
    class="team-modal large"
    :confirm-action-disabled="selectedUsers.length === 0"
    :asyncing="asyncing"
    @close="$emit('close')"
    @confirm="selectAction"
  >
    <UserSelection
      v-show="isSelectingUser && !editedUser"
      :current-users="currentUsers"
      :project="project"
      @select-user="selectUser"
    />

    <RoleSelection
      v-if="isSelectingRoles"
      :is-edit-mode="!!editedUser"
      :selected-categories="selectedCategories"
      :selected-user-role="selectedUserRole"
      :selected-group-role="selectedGroupRole"
      :selected-users="selectedUsers"
      @back-to-user-selection="goBackToUserSelection"
      @select-role="selectRole"
    />
  </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserSelection from './UserSelection.vue'
import RoleSelection from './RoleSelection.vue'
import { addProjectMembers } from '@/api/project-members.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'

export default {
  name: 'TeamDrawer',

  components: { BaseDrawer, UserSelection, RoleSelection },

  props: {
    project: {
      type: Object,
      default: () => ({}),
    },

    currentUsers: {
      type: Array,
      default: () => [],
    },

    editedUser: {
      type: [Object, null, undefined],
      default: null,
    },

    isOpened: {
      type: Boolean,
      default: false,
    },

    selectedCategories: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['close', 'add-user', 'reload-team'],
  setup() {
    const toaster = useToasterStore()
    return {
      toaster,
    }
  },

  data() {
    return {
      isSelectingUser: true,
      validatePick: false,
      selectedUsers: [],
      selectedUserRole: 'owners',
      selectedGroupRole: 'owners',
      isSelectingRoles: false,
      asyncing: false,
      form: {
        team: {
          members: [],
          owners: [],
          reviewers: [],
          member_groups: [],
          owner_groups: [],
          reviewer_groups: [],
        },
      },
    }
  },

  computed: {
    projectSlug() {
      return this.project?.slug || ''
    },

    label() {
      return this.editedUser ? this.$t('team.edit') : this.$t('team.add')
    },
  },

  watch: {
    isOpened: {
      handler: function () {
        if (this.editedUser) {
          this.selectedUsers = [this.editedUser.user]
          this.selectedUserRole = this.editedUser.role
          this.selectedGroupRole = this.editedUser.role
          this.isSelectingRoles = true
          this.isSelectingUser = false
        } else {
          this.selectedUsers = []
          this.selectedUserRole = 'owners'
          this.selectedGroupRole = 'member_groups'
          this.isSelectingUser = true
          this.isSelectingRoles = false
        }
      },
      immediate: true,
    },
  },

  methods: {
    async addTeamMember() {
      this.validatePick = true
      if (this.project.id && !this.isSelectingUser) {
        this.asyncing = true
        try {
          await addProjectMembers(this.project.id, { ...this.form.team })

          analytics.project.addMember({
            project: {
              id: this.project.id,
            },
            members: { ...this.form.team },
          })

          this.$emit('reload-team')

          this.toaster.pushSuccess(this.$t('toasts.team-member-create.success'))

          if (this.$route.name !== 'projectTeam') {
            this.$router.push({
              name: 'projectTeam',
              params: { slugOrId: this.projectSlug },
            })
          }
        } catch (error) {
          this.toaster.pushError(`${this.$t('toasts.team-member-create.error')} (${error})`)
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
      if (this.isSelectingRoles) {
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
      this.form.team.member_groups = []
      this.form.team.owner_groups = []
      this.form.team.reviewer_groups = []

      this.selectedUsers.forEach((user) => {
        if (!this.form.team[user.role].includes(user.id)) {
          this.form.team[user.role].push(user.id)
        }
      })
    },
  },
}
</script>

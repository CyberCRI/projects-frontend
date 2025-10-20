<template>
  <BaseDrawer
    :confirm-action-name="$t('common.add')"
    :is-opened="isOpened"
    :title="capitalize(label)"
    class="team-modal large"
    :confirm-action-disabled="selectedUsers.length === 0"
    @close="$emit('close')"
    @confirm="selectAction"
  >
    <GroupUserSelection
      v-show="mode == 'select'"
      :current-users="currentUsers"
      @select-user="updateUsers"
    />

    <GroupRoleSelection
      v-if="mode == 'roles'"
      :is-edit-mode="!!currentUsers?.length"
      :selected-role="selectedRole"
      :selected-users="selectedUsers"
      @back-to-user-selection="goBackToUserSelection"
      @select-role="updateUsers"
    />
  </BaseDrawer>
</template>

<script>
import { capitalize } from 'es-toolkit'

import BaseDrawer from '@/components/base/BaseDrawer.vue'
import GroupUserSelection from './GroupUserSelection.vue'
import GroupRoleSelection from './GroupRoleSelection.vue'

export default {
  name: 'GroupTeamDrawer',

  components: { BaseDrawer, GroupUserSelection, GroupRoleSelection },

  props: {
    currentUsers: {
      type: Array,
      default: () => [],
    },

    isOpened: {
      type: Boolean,
      default: false,
    },

    mode: {
      type: String,
      default: 'select', // 'select' or 'roles'
    },
  },

  emits: ['close', 'add-user', 'set-mode'],

  setup() {
    return { capitalize }
  },

  data() {
    return {
      selectedUsers: [],
      selectedRole: 'members', // ????
      defaultRole: 'members',
      form: {
        members: [],
        owners: [],
        reviewers: [],
      },
    }
  },

  computed: {
    label() {
      return this.currentUsers?.length ? this.$t('team.edit') : this.$t('team.add')
    },
  },

  watch: {
    isOpened: {
      handler: function (neo) {
        if (neo) this.selectedUsers = [...this.currentUsers]
      },
      immediate: true,
    },
  },

  methods: {
    async addTeamMember() {
      this.$emit('add-user', this.selectedUsers)
      this.$emit('close')
    },

    goBackToUserSelection() {
      this.$emit('set-mode', 'select')
    },

    updateUsers(users) {
      this.selectedUsers = [...users]
    },

    selectAction() {
      if (this.mode == 'roles') {
        this.addTeamMember()
      } else this.$emit('set-mode', 'roles')
    },
  },
}
</script>

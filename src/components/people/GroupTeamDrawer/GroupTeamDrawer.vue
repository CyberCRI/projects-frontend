<template>
  <BaseDrawer
    :confirm-action-name="t('common.add')"
    :is-opened="isOpened"
    :title="capitalize(label)"
    class="team-modal large"
    :confirm-action-disabled="selectedUsers.length === 0"
    @close="emits('close')"
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

<script setup>
import { capitalize } from '@/functs/string'

import BaseDrawer from '@/components/base/BaseDrawer.vue'
import GroupUserSelection from './GroupUserSelection.vue'
import GroupRoleSelection from './GroupRoleSelection.vue'

defineOptions({ name: 'GroupTeamDrawer' })

const props = defineProps({
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
})

const emits = defineEmits(['close', 'add-user', 'set-mode'])
const { t } = useNuxtI18n()
const selectedUsers = ref([])
const selectedRole = 'members'

const label = computed(() => {
  return props.currentUsers?.length ? t('team.edit') : t('team.add')
})

watch(
  props.isOpened,
  (neo) => {
    if (neo) selectedUsers.value = [...props.currentUsers]
  },
  { immediate: true }
)

const addTeamMember = async () => {
  emits('add-user', selectedUsers.value)
  emits('close')
}

const goBackToUserSelection = () => {
  emits('set-mode', 'select')
}

const updateUsers = (users) => {
  selectedUsers.value = [...users]
}

const selectAction = () => {
  if (this.mode == 'roles') {
    addTeamMember()
  } else {
    emits('set-mode', 'roles')
  }
}
</script>

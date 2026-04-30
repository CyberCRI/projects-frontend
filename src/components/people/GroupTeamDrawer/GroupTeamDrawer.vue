<template>
  <BaseDrawer
    :confirm-action-name="t('common.add')"
    :is-opened="isOpened"
    :title="label"
    class="team-modal large"
    :confirm-action-disabled="selectedUsers.length === 0"
    @close="emit('close')"
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

<script setup lang="ts">
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import GroupUserSelection from './GroupUserSelection.vue'
import GroupRoleSelection from './GroupRoleSelection.vue'
import type { UserModel } from '~/models/user.model'

const props = withDefaults(
  defineProps<{
    currentUsers?: UserModel[]
    isOpened?: boolean
    mode?: 'select' | 'roles'
  }>(),
  {
    currentUsers: () => [],
    isOpened: false,
    mode: 'select',
  }
)

const emit = defineEmits(['close', 'add-user', 'set-mode'])
const { t } = useNuxtI18n()
const selectedUsers = ref([])
const selectedRole = 'members'

const label = computed(() => {
  return props.currentUsers?.length ? t('team.edit') : t('team.add')
})

watch(
  () => props.isOpened,
  (neo) => {
    if (neo) selectedUsers.value = [...props.currentUsers]
  },
  { immediate: true }
)

const addTeamMember = async () => {
  emit('add-user', selectedUsers.value)
  emit('close')
}

const goBackToUserSelection = () => {
  emit('set-mode', 'select')
}

const updateUsers = (users) => {
  selectedUsers.value = [...users]
}

const selectAction = () => {
  if (props.mode == 'roles') {
    addTeamMember()
  } else {
    emit('set-mode', 'roles')
  }
}
</script>

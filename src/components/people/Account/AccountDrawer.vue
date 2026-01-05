<template>
  <BaseDrawer :is-opened="isOpened" title="" class="full" no-footer @close="emit('close')">
    <ExistingAccountChecker
      v-if="isAddMode && !targetUser"
      @check-done="onCheckDone"
      @cancel="emit('close')"
    />
    <AccountLayout
      v-else
      ref="account"
      :is-add-mode="isAddMode"
      :is-invite-mode="isInviteMode"
      :selected-user="targetUser || selectedUser"
      @close="emit('close')"
    />
  </BaseDrawer>
</template>
<script setup lang="ts">
import { nextTick } from 'vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import AccountLayout from '@/components/people/Account/AccountLayout.vue'
import ExistingAccountChecker from '@/components/people/Account/ExistingAccountChecker.vue'

import useToasterStore from '@/stores/useToaster'
import { UserModel } from '@/models/user.model'
defineOptions({ name: 'AccountDrawer' })

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    selectedUser?: UserModel
  }>(),
  { isOpened: true, selectedUser: null }
)

const { t } = useNuxtI18n()
const emit = defineEmits(['close'])
const toaster = useToasterStore()
const targetUser = ref(null)

const isAddMode = computed(() => {
  return !props.selectedUser && !targetUser.value?.id
})

const isInviteMode = computed(() => {
  const user = targetUser.value || props.selectedUser
  return !isAddMode.value && !user?.current_org_role // null if not in current org
})

const onCheckDone = (user: UserModel | { email: string }) => {
  targetUser.value = user
  nextTick(() => {
    if (!isAddMode.value) {
      toaster.pushWarning(
        isInviteMode.value ? t('account.switch-to-invite') : t('account.switch-to-edit')
      )
    }
  })
}
</script>

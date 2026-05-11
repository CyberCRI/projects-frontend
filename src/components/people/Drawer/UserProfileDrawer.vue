<template>
  <BaseDrawer
    no-footer
    :is-opened="isOpened"
    :title="$t('profile.drawer_title')"
    @close="$emit('close')"
    @confirm="$emit('close')"
  >
    <UserProfileV2
      v-if="!!userId"
      ref="profile-user"
      :can-edit="false"
      :user-id="userId"
      is-preview
      @close="$emit('close')"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import type { UserModel } from '~/models/user.model'

withDefaults(
  defineProps<{
    isOpened: boolean
    userId?: UserModel['id']
  }>(),
  { userId: null }
)

defineEmits<{
  close: []
}>()
</script>

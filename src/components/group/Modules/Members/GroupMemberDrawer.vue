<template>
  <BaseDrawer
    no-footer
    :is-opened="isOpened"
    :title="$t('profile.drawer_title')"
    @close="$emit('close')"
    @confirm="$emit('close')"
  >
    <UserProfileV2
      v-if="!!memberId"
      ref="profile-user"
      :can-edit="false"
      :user-id="memberId"
      is-preview
      @close="$emit('close')"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import { TranslatedGroupMember } from '@/models/group.model'

withDefaults(
  defineProps<{
    isOpened: boolean
    memberId?: TranslatedGroupMember['id']
  }>(),
  { memberId: null }
)

defineEmits<{
  close: []
}>()
</script>

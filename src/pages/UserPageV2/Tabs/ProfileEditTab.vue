<script setup lang="ts">
import ProfileEdit from '~/components/profile/modules/Profile/ProfileEdit.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <ProfileEdit :user="user" />
  </BaseModuleTab>
</template>

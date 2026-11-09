<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.presentation)"
    :icon="USER_MODULE_ICON.presentation"
  >
    <template #header>
      <AIGeneratedMark class="ai-mark" />
    </template>
    <template #content>
      <ContentExpandable :description="user.researcher.$t.bio" :height-limit="400" />
    </template>
    <template #footer>
      <div class="actions">
        <!-- <BaseModuleButton
          :label="$t('common.see-more')"
          :to="`/profile/${userSlugOrId}/bio`"
          btn-icon="Plus"
        /> -->
        <BaseModuleButton :label="$t('researcher.download-resume')" btn-icon="TrayArrowDown" />
      </div>
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}
</style>

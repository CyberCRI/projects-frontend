<template>
  <BaseModulePreview
    v-if="user.researcher"
    :title="$t(USER_MODULE_TITLE.presentation, user.modules.skills)"
    :icon="USER_MODULE_ICON.skills"
    :total="user.modules.skills"
  >
    <template #header>
      <AIGeneratedMark class="ai-mark" />
    </template>
    <template #content>
      <BaseResearcherPresentation :user="user" />
    </template>
    <template #footer>
      <div class="actions">
        <LinkButton
          :label="$t('common.see-more')"
          :to="`/profile/${userSlugOrId}/bio`"
          btn-icon="Plus"
        />
        <LinkButton :label="$t('researcher.download-resume')" btn-icon="TrayArrowDown" />
      </div>
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{ user: TranslatedUserModel }>()

const userSlugOrId = computed(() => props.user.slug || props.user.id)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}
</style>

<template>
  <BaseModulePreview
    v-if="group.structure"
    :title="$t(GROUP_MODULE_TITLE.presentation)"
    :icon="GROUP_MODULE_ICON.presentation"
  >
    <template #header>
      <AIGeneratedMark class="ai-mark" />
    </template>
    <template #content>
      <BaseStructurePresentation :group="group" preview />
    </template>
    <template #footer>
      <div class="actions">
        <BaseModuleButton
          :label="$t('common.see-more')"
          :to="`/group/${groupSlugOrId}/snapshot`"
          btn-icon="Plus"
        />
        <BaseModuleButton :label="$t('researcher.download-resume')" btn-icon="TrayArrowDown" />
      </div>
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()

const groupSlugOrId = computed(() => props.group.slug || props.group.id)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}
</style>

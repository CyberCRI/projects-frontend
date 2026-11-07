<template>
  <BaseModulePreview
    v-if="group.structure"
    :title="$t(GROUP_MODULE_TITLE.domain, group.structure.modules.domains)"
    :icon="GROUP_MODULE_ICON.domain"
    :total="group.structure.modules.domains"
  >
    <template #top-row>
      <div class="top-buttons">
        <AIGeneratedMark class="ai-mark" />
        <BaseModuleButton
          :to="{
            name: 'groupDomains',
            params: {
              groupIdOrSlug: group.slug || group.id,
            },
          }"
          :label="$t('researcher.view.all-domains')"
          btn-icon="ArrowRight"
        />
      </div>
    </template>
    <template #content>
      <BaseStructureDomain :group="group" preview />
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.top-buttons {
  display: flex;
  justify-content: space-between;
  margin-block: 0.6rem 1rem;
}
</style>

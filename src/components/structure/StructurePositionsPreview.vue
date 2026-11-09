<template>
  <BaseModulePreview
    v-if="group.structure"
    :title="$t(GROUP_MODULE_TITLE.positions)"
    :icon="GROUP_MODULE_ICON.positions"
    :see-more="{
      name: 'groupPositions',
      params: {
        groupIdOrSlug: group.slug || group.id,
      },
    }"
    :see-more-label="$t('researcher.view.all-job-offers')"
  >
    <template #content>
      <BaseStructurePositions :group="group" preview />
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
</style>

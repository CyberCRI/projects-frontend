<template>
  <BaseModulePreview
    v-if="group.structure"
    :title="$t(GROUP_MODULE_TITLE.network)"
    :icon="GROUP_MODULE_ICON.network"
    :see-more="{
      name: 'groupNetwork',
      params: {
        groupIdOrSlug: group.slug || group.id,
      },
    }"
    :see-more-label="$t('researcher.view.all-network')"
  >
    <template #content>
      <BaseResearcherNetwork :group="group" preview />
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

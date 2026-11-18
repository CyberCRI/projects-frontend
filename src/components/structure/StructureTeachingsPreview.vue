<script lang="ts" setup>
import BaseStructureTeaching from '~/components/structure/BaseStructureTeaching.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(GROUP_MODULE_TITLE.teachings, group.structure.modules.teachings)"
    :icon="GROUP_MODULE_ICON.teachings"
  >
    <template #content>
      <BaseStructureTeaching :group="group" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>

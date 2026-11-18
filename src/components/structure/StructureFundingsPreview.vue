<script lang="ts" setup>
import BaseStructureFundings from '~/components/structure/BaseStructureFundings.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(GROUP_MODULE_TITLE.fundings, group.structure.modules.fundings)"
    :icon="GROUP_MODULE_ICON.fundings"
  >
    <template #content>
      <BaseStructureFundings :group="group" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>

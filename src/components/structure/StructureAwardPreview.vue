<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '~/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(GROUP_MODULE_TITLE.awards, group?.structure?.modules?.awards)"
    :icon="GROUP_MODULE_ICON.awards"
  >
    <template #content>
      <BaseStructureAwards :group="group" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>

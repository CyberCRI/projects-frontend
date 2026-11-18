<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ group: TranslatedPeopleGroupModel; editable?: boolean }>(), {
  editable: false,
})
</script>

<template>
  <BaseModuleTab
    :title="$t(GROUP_MODULE_TITLE.teachingsTab, group.structure?.modules?.teachings)"
    :count="group.structure?.modules?.teachings"
  >
    <BaseStructureTeaching :editable="editable" :group="group" />
  </BaseModuleTab>
</template>

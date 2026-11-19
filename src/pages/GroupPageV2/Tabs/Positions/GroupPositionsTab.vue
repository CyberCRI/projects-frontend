<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ group: TranslatedPeopleGroupModel; editable?: boolean }>(), {
  editable: false,
})
</script>

<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.positionsTab)">
    <BaseStructurePositions v-if="!editable" :group="group" />
  </BaseModuleTab>
</template>

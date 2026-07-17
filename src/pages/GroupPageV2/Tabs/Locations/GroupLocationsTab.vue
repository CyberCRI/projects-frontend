<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.locations, countElement)" :count="countElement">
    <GroupLocationBase :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.group.modules?.locations)
</script>

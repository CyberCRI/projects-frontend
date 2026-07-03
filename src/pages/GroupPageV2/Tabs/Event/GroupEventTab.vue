<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.event)" :count="countElement">
    <BaseGroupEventList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models/people-group.model'
import BaseGroupEventList from '@/components/group/Modules/Event/BaseGroupEventList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const countElement = computed<number>(() => props.group.modules?.event)
</script>

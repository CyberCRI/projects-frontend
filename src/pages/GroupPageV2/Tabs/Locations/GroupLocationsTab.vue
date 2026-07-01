<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.locations, countElement)" :count="countElement">
    <GroupLocationBase :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle } from '@/models/people-group.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.group.modules?.locations)
</script>

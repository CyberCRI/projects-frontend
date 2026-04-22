<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.event)" :count="countElement">
    <BaseGroupEventList :group="group" :editable="isInEditingMode" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupEventList from '@/components/group/Modules/Event/BaseGroupEventList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isInEditingMode?: boolean
  }>(),
  {
    isInEditingMode: false,
  }
)

const countElement = computed<number>(() => props.group.modules?.event)
</script>

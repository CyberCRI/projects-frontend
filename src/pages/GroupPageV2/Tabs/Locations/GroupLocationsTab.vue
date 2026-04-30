<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.locations, countElement)" :count="countElement">
    <GroupLocationBase :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle } from '@/models/invitation.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.locations)
</script>

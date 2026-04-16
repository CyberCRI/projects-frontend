<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.locations, countElement)" :count="countElement">
    <GroupLocationBase :group="group" :editable="editable" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.group.modules?.locations)
</script>

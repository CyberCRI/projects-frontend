<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.locations)" :count="countElement">
    <GroupLocationBase :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.locations)
</script>

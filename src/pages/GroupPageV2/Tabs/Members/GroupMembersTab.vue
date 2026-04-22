<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.members)" :count="countElement">
    <BaseGroupMembersList :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>

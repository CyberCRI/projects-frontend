<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.members)" :count="countElement">
    <BaseGroupMembersList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle } from '@/models/people-group.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  editable?: boolean
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>

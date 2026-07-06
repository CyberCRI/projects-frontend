<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.members)" :count="countElement">
    <BaseGroupMembersList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  editable?: boolean
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>

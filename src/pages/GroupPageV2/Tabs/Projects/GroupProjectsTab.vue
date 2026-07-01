<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.featured_projects)" :count="countElement">
    <BaseGroupProjectsList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'
import { GroupModuleTitle } from '@/models/people-group.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  editable?: boolean
}>()

const countElement = computed(() => props.group.modules?.featured_projects)
</script>

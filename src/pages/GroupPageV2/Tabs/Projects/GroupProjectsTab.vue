<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.featured_projects)" :count="countElement">
    <BaseGroupProjectsList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  editable?: boolean
}>()

const countElement = computed(() => props.group.modules?.featured_projects)
</script>

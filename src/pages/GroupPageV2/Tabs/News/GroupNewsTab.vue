<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.news)" :count="countElement">
    <BaseGroupNewsList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const countElement = computed<number>(() => props.group.modules?.news || 0)
</script>

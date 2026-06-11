<template>
  <BaseModuleTab :title="tab.$t.title" :count="tab.modules.items">
    <BaseProjectTab :project="project" :tab="tab" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectTab from '~/components/project/modules/Additionals/BaseProjectTab.vue'
import type { TranslatedProjectTab } from '~/models/projects-tabs.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'

withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

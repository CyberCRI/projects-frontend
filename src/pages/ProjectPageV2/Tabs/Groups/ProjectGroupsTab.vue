<script setup lang="ts">
import BaseProjectGroupsList from '~/components/project/modules/Groups/BaseProjectGroupsList.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

<template>
  <BaseModuleTab :title="tab.$t.title" :count="tab.modules.items" :header="false">
    <BaseProjectGroupsList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

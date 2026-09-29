<script setup lang="ts">
import BaseProjectMemberList from '~/components/project/modules/Members/BaseProjectMemberList.vue'
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
    <BaseProjectMemberList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

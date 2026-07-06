<script setup lang="ts">
import BaseProjectMemberList from '~/components/project/modules/Members/BaseProjectMemberList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from 'shared-projects-frontend'

withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

<template>
  <BaseModuleTab :header="false">
    <BaseProjectMemberList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

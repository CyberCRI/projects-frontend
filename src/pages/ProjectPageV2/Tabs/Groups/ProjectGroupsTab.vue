<script setup lang="ts">
import BaseProjectGroupsList from '~/components/project/modules/Groups/BaseProjectGroupsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'

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
    <BaseProjectGroupsList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

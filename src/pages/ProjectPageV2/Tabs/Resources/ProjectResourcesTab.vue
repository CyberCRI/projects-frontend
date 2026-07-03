<template>
  <BaseModuleTab :header="false">
    <BaseProjectResources :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

withDefaults(defineProps<{ project: TranslatedProject; editable?: boolean }>(), {
  editable: false,
})
</script>

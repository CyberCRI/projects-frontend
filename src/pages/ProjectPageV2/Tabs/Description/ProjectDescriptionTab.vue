<template>
  <BaseModuleTab :title="project.$t.title">
    <BaseDescription :title="project.$t.title" :description="project.$t.description" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseDescription from '~/components/modules/Abstract/BaseDescription.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style lang="scss" scoped>
.description-content {
  background: $white;
  padding: $space-l 0;
  padding-top: 0;
  overflow-wrap: break-word;
  color: $almost-black;
  flex-grow: 1;
  overflow: auto;
}
</style>

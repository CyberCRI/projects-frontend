<template>
  <BaseModuleTab :title="project.$t.title">
    <BaseText :title="project.$t.title" :description="project.$t.description" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseText from '~/components/project/modules/Additionals/Types/Text/BaseText.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '~/models/project.model'

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

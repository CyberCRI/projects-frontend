<template>
  <ContentExpandable :description="project.$t.description" :height-limit="400" />
</template>

<script setup lang="ts">
import ContentExpandable from '@/components/base/ContentExpandable.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

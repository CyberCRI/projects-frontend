<script setup lang="ts">
import type { TranslatedProject } from 'shared-projects-frontend/models'
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'

defineProps<{
  project: TranslatedProject
}>()

const attrs = useAttrs()
</script>

<template>
  <BaseCardInline
    :label="project.$t.title"
    :image="project.header_image"
    :default-picture="DEFAULT_PROJECT_PATATOID"
    v-bind="attrs"
  />
</template>

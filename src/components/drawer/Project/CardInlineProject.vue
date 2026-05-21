<script setup lang="ts">
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'
import type { TranslatedProject } from '~/models/project.model'

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

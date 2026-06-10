<script setup lang="ts">
import type { TranslatedProjectTab, TranslatedProjectTabItem } from '~/models/projects-tabs.model'
import BlogEntry from '~/components/project/modules/BlogEntries/BlogEntry.vue'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import type { TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    item: TranslatedProjectTabItem
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

<template>
  <BlogEntry :project="project" :blog-entry="item as unknown as TranslatedBlogEntry" />
</template>

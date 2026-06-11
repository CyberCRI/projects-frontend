<script setup lang="ts">
import BlogEntry from '~/components/project/modules/BlogEntries/BlogEntry.vue'
import type { TranslatedProjectTabItem } from '~/models/projects-tabs.model'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import type { TranslatedProject } from '@/models/project.model'

withDefaults(
  defineProps<{
    project: TranslatedProject
    item: TranslatedProjectTabItem
    editable?: boolean
  }>(),
  { editable: false }
)

defineEmits<{
  delete: []
  edit: []
}>()
</script>

<template>
  <BlogEntry
    :project="project"
    :blog-entry="item as unknown as TranslatedBlogEntry"
    :can-edit="editable"
    :can-delete="editable"
    @delete="$emit('delete')"
    @edit="$emit('edit')"
  />
</template>

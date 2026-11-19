<script setup lang="ts">
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectBlog',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseBlogEntryList :project="project" preview :limit="4" />
    </template>
  </BaseModulePreview>
</template>

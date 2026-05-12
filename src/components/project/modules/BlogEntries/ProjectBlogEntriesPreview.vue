<script setup lang="ts">
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.blogs)"
    :icon="ProjectModuleIcon.blogs"
    :total="project.modules.blogs"
    :see-more="{
      name: 'projectBlog',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseBlogEntryList :project="project" preview />
    </template>
  </BaseModulePreview>
</template>

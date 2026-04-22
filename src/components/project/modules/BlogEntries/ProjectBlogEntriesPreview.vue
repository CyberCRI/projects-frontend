<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.blogs)"
    :icon="ProjectModuleIcon.blogs"
    :total="project.modules.blogs"
    :see-more="{
      name: 'projectBlog',
      params: { slugOrid: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseBlogEntryList :project="project" preview />
    </template>
  </BaseModulePreview>
</template>

<script setup lang="ts">
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.blogs)"
    :icon="PROJECT_MODULE_ICON.blogs"
    :total="project.modules.blogs"
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

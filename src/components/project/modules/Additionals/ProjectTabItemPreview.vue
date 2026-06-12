<script setup lang="ts">
import BaseProjectTabBlog from '~/components/project/modules/Additionals/Types/Blog/BaseProjectTabBlog.vue'
import type { TranslatedProjectTab } from '~/models/projects-tabs.model'
import type { TranslatedProject } from '~/models/project.model'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectAdditionals',
      params: { slugOrId: project.slug || project.id, tabId: tab.id },
    }"
  >
    <template #content>
      <BaseProjectTabBlog
        v-if="tab.type === 'blog'"
        :project="project"
        :tab="tab"
        preview
        :limit="4"
      />
      <BaseProjectTabText v-else-if="tab.type === 'text'" :project="project" :tab="tab" preview />
    </template>
  </BaseModulePreview>
</template>

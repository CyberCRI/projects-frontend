<script setup lang="ts">
import BaseProjectTab from '~/components/project/modules/Additionals/BaseProjectTab.vue'
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
      <BaseProjectTab :project="project" :tab="tab" preview :limit="4" />
    </template>
  </BaseModulePreview>
</template>

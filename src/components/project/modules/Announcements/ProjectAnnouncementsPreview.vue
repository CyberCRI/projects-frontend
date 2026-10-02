<script setup lang="ts">
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectAnnouncements',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectAnnouncements :project="project" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>

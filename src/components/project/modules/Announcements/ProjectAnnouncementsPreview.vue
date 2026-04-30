<script setup lang="ts">
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.announcements)"
    :icon="ProjectModuleIcon.announcements"
    :total="project.modules.announcements"
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

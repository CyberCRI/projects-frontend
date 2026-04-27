<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

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

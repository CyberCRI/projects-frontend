<script setup lang="ts">
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.announcements)"
    :icon="PROJECT_MODULE_ICON.announcements"
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

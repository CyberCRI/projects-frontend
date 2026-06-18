<script setup lang="ts">
import BaseProjectGroupsList from '~/components/project/modules/Groups/BaseProjectGroupsList.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.groups)"
    :icon="ProjectModuleIcon.groups"
    :total="project.modules.groups"
    :see-more="{
      name: 'projectGroups',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectGroupsList :project="project" :limit="5" preview />
    </template>
  </BaseModulePreview>
</template>

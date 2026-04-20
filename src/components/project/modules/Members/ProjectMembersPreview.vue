<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseProjectMembersList from '@/components/project/modules/Members/BaseProjectMembersList.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview :title="$t(ProjectModuleTitle.members)" :icon="ProjectModuleIcon.members">
    <template #content>
      <BaseProjectMembersList :project="project" />
    </template>
  </BaseModulePreview>
</template>

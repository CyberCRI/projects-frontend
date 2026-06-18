<script setup lang="ts">
import BaseProjectMemberList from '~/components/project/modules/Members/BaseProjectMemberList.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.members)"
    :icon="ProjectModuleIcon.members"
    :total="project.modules.members"
    :see-more="{
      name: 'projectMembers',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectMemberList :project="project" :limit="5" preview />
    </template>
  </BaseModulePreview>
</template>

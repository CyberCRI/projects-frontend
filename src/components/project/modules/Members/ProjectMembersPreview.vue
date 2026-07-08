<script setup lang="ts">
import BaseProjectMemberList from '~/components/project/modules/Members/BaseProjectMemberList.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.members)"
    :icon="PROJECT_MODULE_ICON.members"
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

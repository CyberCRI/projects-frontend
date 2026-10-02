<script setup lang="ts">
import BaseProjectMemberList from '~/components/project/modules/Members/BaseProjectMemberList.vue'
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
      name: 'projectMembers',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectMemberList :project="project" :limit="5" preview />
    </template>
  </BaseModulePreview>
</template>

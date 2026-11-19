<script setup lang="ts">
import BaseProjectGroupsList from '~/components/project/modules/Groups/BaseProjectGroupsList.vue'
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
      name: 'projectGroups',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectGroupsList :project="project" :limit="5" preview />
    </template>
  </BaseModulePreview>
</template>

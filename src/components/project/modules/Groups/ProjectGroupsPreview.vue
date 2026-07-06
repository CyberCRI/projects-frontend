<script setup lang="ts">
import BaseProjectGroupsList from '~/components/project/modules/Groups/BaseProjectGroupsList.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from 'shared-projects-frontend'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.groups)"
    :icon="PROJECT_MODULE_ICON.groups"
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

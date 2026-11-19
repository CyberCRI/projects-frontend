<script setup lang="ts">
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import ContentExpandable from '@/components/base/ContentExpandable.vue'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :see-more="{
      name: 'projectDescription',
      params: {
        slugOrId: project.slug || project.id,
      },
    }"
  >
    <template #content>
      <ContentExpandable :description="project.$t.description" :height-limit="400" />
    </template>
  </BaseModulePreview>
</template>

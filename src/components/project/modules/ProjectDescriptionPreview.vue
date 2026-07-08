<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import ContentExpandable from '@/components/base/ContentExpandable.vue'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t('project.description')"
    icon="Briefcase"
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

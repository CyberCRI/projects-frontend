<script setup lang="ts">
import ContentExpandable from '@/components/base/ContentExpandable.vue'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { TranslatedProject } from '@/models/project.model'

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
      <!-- <DescriptionPlaceholder v-if="canEditProject && descripitonEmpty" class="unboxed" :project="project" /> -->
      <ContentExpandable :description="project.$t.description" :height-limit="400" />
    </template>
  </BaseModulePreview>
</template>

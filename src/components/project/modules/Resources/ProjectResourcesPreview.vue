<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

const props = defineProps<{ project: TranslatedProject }>()

const resources = computed(() => props.project.modules.links + props.project.modules.files)
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.resources)"
    :icon="ProjectModuleIcon.links"
    :total="resources"
    :see-more="{
      name: 'projectResources',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectResources :project="project" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>

<style lang="scss" scoped>
.resources-list {
  display: flex;
  gap: 1rem;
}
</style>

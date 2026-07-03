<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

const props = defineProps<{ project: TranslatedProject }>()

const resources = computed(() => props.project.modules.links + props.project.modules.files)
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.resources)"
    :icon="PROJECT_MODULE_ICON.links"
    :total="resources"
    :see-more="{
      name: 'projectResources',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <div class="flat-resources">
        <BaseProjectResources :project="project" preview :limit="3" />
      </div>
    </template>
  </BaseModulePreview>
</template>

<style lang="scss" scoped>
.resources-list {
  display: flex;
  gap: 1rem;
}
</style>

<style lang="scss">
.flat-resources {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  .resource-container {
    display: contents !important;
  }
}
</style>

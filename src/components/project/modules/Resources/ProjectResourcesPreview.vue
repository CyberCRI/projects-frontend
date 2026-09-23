<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
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
@use '~/design/scss/variables';

.resources-list {
  display: flex;
  gap: 1rem;
}
</style>

<style lang="scss" scoped>
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

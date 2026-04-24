<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = defineProps<{ project: TranslatedProject }>()

const target = computed(() => ({
  name: 'projectResources',
  params: { slugOrid: props.project.slug || props.project.id },
}))
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.links)"
    :icon="ProjectModuleIcon.links"
    :total="project.modules.links"
    :see-more="target"
  >
    <template #content>
      <div class="resources-list">
        <ResourceCount :count="project.modules.files" :is-file="true" :target="target" />
        <ResourceCount :count="project.modules.links" :is-file="false" :target="target" />
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

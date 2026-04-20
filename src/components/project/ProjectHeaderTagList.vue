<template>
  <div class="tag-list-ctn">
    <TagsList
      :tags="project.tags"
      class="tag-list"
      prefix="mobile"
      :to="{
        name: 'ProjectSearch',
        query: {
          section: 'projects',
        },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import TagsList from '@/components/tags/TagsList.vue'
import { TranslatedProject } from '@/models/project.model'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style scoped lang="scss">
.tag-ctn-skeleton {
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: $space-2xs;
  overflow: hidden;
}
</style>

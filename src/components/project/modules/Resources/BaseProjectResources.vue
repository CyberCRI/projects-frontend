<script setup lang="ts">
import BaseProjectFiles from '~/components/project/modules/Resources/BaseProjectFiles.vue'
import BaseProjectLink from '~/components/project/modules/Resources/BaseProjectLink.vue'
import type { TranslatedProject } from '@/models/project.model'

withDefaults(
  defineProps<{
    project: TranslatedProject
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)
</script>

<template>
  <BaseProjectFiles
    v-if="project.modules.files || editable"
    :project="project"
    :preview="preview"
    :editable="editable"
    :limit="limit"
  />
  <BaseProjectLink
    v-if="project.modules.links || editable"
    :project="project"
    :preview="preview"
    :editable="editable"
    :limit="limit"
  />
</template>

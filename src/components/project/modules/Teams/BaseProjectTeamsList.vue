<script setup lang="ts">
import BaseProjectTeamsGroupList from '~/components/project/modules/Teams/BaseProjectTeamsGroupList.vue'
import BaseProjectTeamsUserList from '~/components/project/modules/Teams/BaseProjectTeamsUserList.vue'
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
  <BaseProjectTeamsUserList
    v-if="project.modules.members"
    :project="project"
    :limit="limit"
    :preview="preview"
    :editable="editable"
  />
  <BaseProjectTeamsGroupList
    v-if="project.modules.groups"
    :project="project"
    :limit="limit"
    :preview="preview"
    :editable="editable"
  />
</template>

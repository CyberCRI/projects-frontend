<template>
  <BaseModuleTab :title="tab.$t.title" :count="tab.type === 'blog' ? tab.modules.items : 0">
    <BaseProjectTabBlog
      v-if="tab.type === 'blog'"
      :project="project"
      :tab="tab"
      :editable="editable"
    />
    <BaseProjectTabText
      v-else-if="tab.type === 'text'"
      :project="project"
      :tab="tab"
      :editable="editable"
    />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectTabText from '~/components/project/modules/Additionals/Types/Text/BaseProjectTabText.vue'
import BaseProjectTabBlog from '~/components/project/modules/Additionals/Types/Blog/BaseProjectTabBlog.vue'
import type { TranslatedProjectTab } from 'shared-projects-frontend/models/projects-tabs.model'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

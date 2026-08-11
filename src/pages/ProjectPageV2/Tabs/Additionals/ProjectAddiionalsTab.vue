<template>
  <BaseModuleTab :title="tab.$t.title" :count="tab.type === 'blog' ? tab.modules.items : 0">
    <BaseProjectTabBlog
      v-if="tab.type === 'blog'"
      :project="project"
      :tab="tab"
      :editable="editable"
      :template="template"
    />
    <BaseProjectTabText
      v-else-if="tab.type === 'text'"
      :project="project"
      :tab="tab"
      :editable="editable"
      :template="template"
    />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectTabText from '~/components/project/modules/Additionals/Types/Text/BaseProjectTabText.vue'
import BaseProjectTabBlog from '~/components/project/modules/Additionals/Types/Blog/BaseProjectTabBlog.vue'
import type { TranslatedProjectTab, TranslatedProject } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
    template?: boolean
  }>(),
  { editable: false, template: false }
)
</script>

<template>
  <BaseModuleTab :title="tab.$t.title" :count="tab.modules.items" :header="false">
    <BaseProjectResources :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

withDefaults(
  defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab; editable?: boolean }>(),
  {
    editable: false,
  }
)
</script>

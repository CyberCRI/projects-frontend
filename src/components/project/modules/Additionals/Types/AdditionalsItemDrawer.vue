<script setup lang="ts">
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import type {
  TranslatedProjectTab,
  TranslatedProjectTabItem,
  TranslatedProject,
} from 'shared-projects-frontend/models'
import InlineAdditionalsItemForm from '~/components/project/modules/Additionals/Types/InlineAdditionalsItemForm.vue'

withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    item?: TranslatedProjectTabItem
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
    item: null,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()
</script>

<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('tab.item.title')"
    no-footer
    class="blog-drawer"
    @close="emit('close')"
  >
    <InlineAdditionalsItemForm
      v-if="isOpened"
      :project="project"
      :tab="tab"
      :item="item"
      @reload="emit('reload')"
      @close="emit('close')"
    />
  </BaseDrawer>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.blog-drawer {
  height: 100%;

  :deep(.drawer__main) {
    gap: variables.$space-unit;
  }

  .content-editor {
    flex-grow: 1;
    min-height: variables.pxtorem(300px);
  }
}

.editor-section {
  display: flex;
  flex-direction: column;
}
</style>

<script setup lang="ts">
import TipTapOutput from '~/components/base/form/TextEditor/TipTapOutput.vue'
import type { TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import HelpField from '~/components/base/form/HelpField.vue'
import { textIsEmpty } from '~/functs/tiptap'

withDefaults(
  defineProps<{
    tab: TranslatedProjectTab
    editable?: boolean
    preview?: boolean
  }>(),
  { editable: false, preview: false }
)
</script>

<template>
  <template v-if="!preview">
    <!-- descriptions -->
    <BaseModuleHeader v-if="editable" :editable="false" />

    <HelpField v-if="!textIsEmpty(tab.$t.description)" class="description-info">
      <ContentExpandable key="description" :height-limit="300">
        <TipTapOutput :content="tab.$t.description" />
      </ContentExpandable>
    </HelpField>
  </template>

  <slot />
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.description-info {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid color-mix(in srgb, var(--primary-dark), transparent 85%);
}
</style>

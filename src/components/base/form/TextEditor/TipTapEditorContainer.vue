<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import type { Editor } from '@tiptap/vue-3'

const props = withDefaults(
  defineProps<{
    mode: string
    editor?: Editor
    errors?: ErrorObject[]
  }>(),
  {
    editor: null,
    errors: () => [],
  }
)

const attrs = useAttrs()

// methods
const onFocus = () => {
  if (props.editor) {
    props.editor.commands.focus('end')
  }
}

const { locale } = useNuxtI18n()
</script>
<template>
  <div
    :class="{
      ['editor editor-' + mode]: true,
      ['lang-' + locale]: true,
      errors: !!errors?.length,
    }"
    v-bind="attrs"
    @click.self="onFocus"
  >
    <slot />
  </div>
  <Transition name="fade">
    <div v-if="errors?.length" class="errors-tiptap">
      <field-errors :errors="errors" />
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.errors-tiptap {
  width: 100%;
  transition: all 0.2s;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  & > * {
    margin: 0;
    padding: 1rem;
  }
}

.editor {
  overflow: hidden;
  border-radius: $border-radius-l;
  border: $border-width-s solid var(--primary);
  display: flex;
  flex-flow: column nowrap;

  &.errors {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &.no-max-height {
    :deep(.editor-content) {
      max-height: none;
    }
  }

  &.min-height-100 {
    :deep(.editor-content) {
      min-height: 100%;
    }
  }
}
</style>

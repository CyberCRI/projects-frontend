<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu'

import { DEFAULT_COLOR_TIPTAP } from '~/functs/constants.js'
import type { IconImageChoice } from '~/functs/IconImage.js'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { t } = useNuxtI18n()

const setColor = (color) => props.editor.chain().focus().setColor(color).run()

const items = computed(() => [
  {
    icon: 'Close' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.color.remove-color'),
    action: () => props.editor.chain().focus().unsetColor().run(),
  },
])
</script>

<template>
  <LpiBubbleMenu
    :editor="editor"
    class="linkmenu"
    plugin-key="ColorMenu"
    :should-show="
      ({ editor }) => editor.isActive('paragraph') && !editor.view.state.selection.empty
    "
  >
    <ContexttualToolMenu class="link-menu-bar">
      <button
        v-for="item in DEFAULT_COLOR_TIPTAP"
        :key="item.color"
        :title="t(item.label)"
        class="color-preview pointer"
        :style="`--color: ${item.color}`"
        @click="() => setColor(item.color)"
      />
      <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>

<style lang="scss" scoped>
.color-preview {
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--color);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
}
</style>

<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu'

import MenuItem from '~/components/base/form/TextEditor/MenuItem.vue'
import { DEFAULT_COLOR_TIPTAP } from '~/functs/constants.js'
import type { IconImageChoice } from '~/functs/IconImage.js'
import ContexttualToolMenu from './ContexttualToolMenu.vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { t } = useNuxtI18n()

const setColor = (color) => props.editor.chain().focus().setColor(color).run()

const items = computed(() => [
  {
    icon: 'Close' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.remove_link'),
    action: () => props.editor.chain().focus().unsetColor().run(),
  },
])
</script>

<template>
  <LpiBubbleMenu
    :editor="editor"
    class="linkmenu"
    :should-show="({ editor }) => editor.isActive('textStyle')"
  >
    <ContexttualToolMenu class="link-menu-bar">
      <MenuItem
        v-for="color in DEFAULT_COLOR_TIPTAP"
        :key="color"
        :title="$t('multieditor.color.color')"
        :action="() => setColor(color)"
      >
        <div class="color-preview" :style="`--color: ${color}`" />
      </MenuItem>
      <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>

<style lang="scss" scoped>
.color-preview {
  width: 1rem;
  height: 1rem;
  background-color: var(--color);
}
</style>

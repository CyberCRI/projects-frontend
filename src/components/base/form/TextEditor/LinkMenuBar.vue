<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu'

import MenuItem from '~/components/base/form/TextEditor/MenuItem.vue'
import type { IconImageChoice } from '~/functs/IconImage.js'
import ContexttualToolMenu from './ContexttualToolMenu.vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  open: []
}>()
const { t } = useNuxtI18n()

const items = computed(() => [
  {
    icon: 'ExternalLink' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.external_link'),
    action: () => {
      window.open(props.editor.getAttributes('link').href, '_blank')
    },
  },
  {
    icon: 'Pen' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.edit-link'),
    action: () => emit('open'),
  },
  {
    icon: 'Close' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.remove_link'),
    action: () => props.editor.chain().focus().extendMarkRange('link').deleteSelection().run(),
    disabled: !props.editor.can().unsetLink(),
  },
])
</script>

<template>
  <LpiBubbleMenu
    :editor="editor"
    class="linkmenu"
    :should-show="({ editor }) => editor.isActive('link')"
    plugin-key="LinkMenu"
  >
    <ContexttualToolMenu class="link-menu-bar">
      <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>

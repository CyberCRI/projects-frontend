<template>
  <LpiBubbleMenu
    ref="bubble"
    :editor="editor"
    :should-show="({ editor }) => editor.isActive('external-video')"
    class="videomenu"
    :tippy-options="tippyOptions"
    deep-selector="iframe"
  >
    <ContextualToolMenu class="video-menu-bar">
      <TextButtonMenuItem v-for="(item, index) in labeledItems" :key="'a' + index" :item="item" />
      <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
    </ContextualToolMenu>
  </LpiBubbleMenu>
</template>

<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu'

import menuBarTippyOptions from '~/functs/menuBarTippyOptions'
import ContextualToolMenu from './ContexttualToolMenu.vue'
import TextButtonMenuItem from './TextButtonMenuItem.vue'
import type { Editor } from '@tiptap/vue-3'
import type MenuItem from './MenuItem.vue'

const props = defineProps<{
  editor: Editor
}>()

const labeledItems = computed(() => [
  {
    label: 'Small',
    title: '25% width',
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'small' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'small',
    isDisabled: () => false,
  },
  {
    label: 'Medium',
    title: '50% width',
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'medium' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'medium',
    isDisabled: () => false,
  },
  {
    label: 'Large',
    title: '75% width',
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'large' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'large',
    isDisabled: () => false,
  },
  {
    label: 'Full',
    title: '100% width',
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'full' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'full',
    isDisabled: () => false,
  },
])

const items = computed(() => [
  {
    icon: 'close-circle-line',
    title: 'multieditor.delete_video',
    action: () => props.editor.chain().focus().deleteExternalVideo().run(),
  },
])

const bubbleRef = useTemplateRef('bubble')
const tippyOptions = menuBarTippyOptions(bubbleRef, '.ProseMirror-selectednode iframe')
</script>

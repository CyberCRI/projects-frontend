<template>
  <LpiBubbleMenu
    ref="bubble"
    :editor="editor"
    :should-show="({ editor }) => editor.isActive('external-video')"
    class="videomenu"
    :tippy-options="tippyOptions"
    deep-selector="iframe"
    plugin-key="VideoMenu"
  >
    <ContexttualToolMenu class="video-menu-bar">
      <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>

<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu'

import ContexttualToolMenu from './Custom/ContexttualToolMenu.vue/index.js'
import menuBarTippyOptions from '~/functs/menuBarTippyOptions'
import type { IconImageChoice } from '~/functs/IconImage.js'
import type MenuItem from './Custom/MenuItem.vue/index.js'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const { t } = useNuxtI18n()

const items = computed(() => [
  {
    label: t('multieditor.image.small'),
    title: t('multieditor.image.25_width'),
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'small' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'small',
    isDisabled: false,
  },
  {
    label: t('multieditor.image.medium'),
    title: t('multieditor.image.50_width'),
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'medium' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'medium',
    isDisabled: false,
  },
  {
    label: t('multieditor.image.large'),
    title: t('multieditor.image.75_width'),
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'large' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'large',
    isDisabled: false,
  },
  {
    label: t('multieditor.image.full'),
    title: t('multieditor.image.100_width'),
    action: () => props.editor.commands.updateAttributes('external-video', { size: 'full' }),
    isActive: () => props.editor.getAttributes('external-video').size == 'full',
    isDisabled: false,
  },
  {
    icon: 'Close' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.delete_video'),
    action: () => props.editor.chain().focus().deleteExternalVideo().run(),
  },
])

const bubbleRef = useTemplateRef('bubble')
const tippyOptions = menuBarTippyOptions(bubbleRef, '.ProseMirror-selectednode iframe')
</script>

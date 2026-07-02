<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu'

import menuBarTippyOptions from '~/composables/tiptap/menuBarTippyOptions'
import type { IconImageChoice } from '~/functs/IconImage.js'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { t } = useNuxtI18n()

const fixSelection = (wrapped) => {
  return () => {
    let sel = null
    props.editor
      .chain()
      .focus()
      .command((arg) => {
        sel = arg.state.selection
        return true
      })
      .run()
    wrapped()
    props.editor.chain().focus().setNodeSelection(sel.ranges[0].$from.pos).run()
  }
}

const items = computed(() => [
  {
    label: t('multieditor.image.small'),
    title: t('multieditor.image.25_width'),
    action: fixSelection(() => props.editor.commands.updateAttributes('image', { size: 'small' })),
    isActive: () => props.editor.getAttributes('image').size === 'small',
  },
  {
    label: t('multieditor.image.medium'),
    title: t('multieditor.image.50_width'),
    action: fixSelection(() => props.editor.commands.updateAttributes('image', { size: 'medium' })),
    isActive: () => props.editor.getAttributes('image').size === 'medium',
  },
  {
    label: t('multieditor.image.large'),
    title: t('multieditor.image.75_width'),
    action: fixSelection(() => props.editor.commands.updateAttributes('image', { size: 'large' })),
    isActive: () => props.editor.getAttributes('image').size === 'large',
  },
  {
    label: t('multieditor.image.full'),
    title: t('multieditor.image.100_width'),
    action: fixSelection(() => props.editor.commands.updateAttributes('image', { size: 'full' })),
    isActive: () => props.editor.getAttributes('image').size === 'full',
  },
  {
    label: t('multieditor.image.original'),
    title: t('multieditor.image.original_size'),
    action: fixSelection(() =>
      props.editor.commands.updateAttributes('image', { size: 'original' })
    ),
    isActive: () => props.editor.getAttributes('image').size === 'original',
  },
  {
    icon: 'Close' satisfies IconImageChoice as IconImageChoice,
    title: t('multieditor.delete_image'),
    action: () => props.editor.chain().focus().deleteSelection().run(),
  },
])

const bubbleRef = useTemplateRef('bubble')
const tippyOptions = menuBarTippyOptions(bubbleRef)
</script>

<template>
  <LpiBubbleMenu
    ref="bubble"
    :editor="editor"
    :should-show="({ editor }) => editor.isActive('image')"
    class="tablemenu"
    :tippy-options="tippyOptions"
    plugin-key="ImageMenu"
  >
    <ContexttualToolMenu class="image-menu-bar">
      <MenuItem v-for="item in items" :key="item.label" v-bind="item" />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>

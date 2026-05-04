<template>
  <div>
    <LpiBubbleMenu
      :editor="editor"
      class="linkmenu"
      :should-show="({ editor }) => editor.isActive('link')"
    >
      <ContextualToolMenu class="link-menu-bar">
        <MenuItem v-for="item in items" :key="item.title" v-bind="item" />
      </ContextualToolMenu>
    </LpiBubbleMenu>
  </div>
</template>

<script setup lang="ts">
import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu'

import ContextualToolMenu from './ContexttualToolMenu.vue'
import type { Editor } from '@tiptap/vue-3'
import type MenuItem from './MenuItem.vue'

const props = defineProps<{
  editor: Editor
  openLinkModal: () => void
}>()

const items = computed(() => [
  {
    icon: 'external-link-line',
    title: 'multieditor.external_link',
    action: () => {
      window.open(props.editor.getAttributes('link').href, '_blank')
    },
  },
  {
    icon: 'edit-line',
    title: 'multieditor.edit-link',
    action: () => {
      props.openLinkModal()
    },
  },
  {
    icon: 'close-circle-line',
    title: 'multieditor.remove_link',
    action: () => props.editor.chain().focus().extendMarkRange('link').unsetLink().run(),
    isDisabled: !props.editor.can().unsetLink(),
  },
])
</script>

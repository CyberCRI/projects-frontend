<script setup lang="ts">
/**
 * This is a copy of ueberdosis/tiptap's BubbleMenu component (based on v2.0.3)
 * for the sake of using our own version of extension-bubble-menu (now extension-lpi-bubble-menu)
 * witch allow trigger the menu with empty selection (i.e. just a caret) and
 * based on editor' selection change event instead of blur
 * so we can do accurate check on current selection type
 */
import {
  LpiBubbleMenuPlugin,
  type LpiBubbleMenuPluginProps,
} from '~/composables/tiptap/extensions/LpiBubblePlugin'
import type { Plugin } from '@tiptap/pm/state'

const props = defineProps<Omit<LpiBubbleMenuPluginProps, 'element'>>()
const root = useTemplateRef('root')
const plugin = ref<Plugin>()

onMounted(() => {
  const options = {
    ...props,
    element: root.value as HTMLElement,
  }
  plugin.value = LpiBubbleMenuPlugin(options)
  props.editor.registerPlugin(plugin.value)
})

onBeforeUnmount(() => {
  if (plugin.value) {
    props.editor.unregisterPlugin(plugin.value.spec.key)
  }
})
</script>

<template>
  <div ref="root"><slot /></div>
</template>

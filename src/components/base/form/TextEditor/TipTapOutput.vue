<script setup lang="ts">
import fixEditorContent from '~/composables/tiptap/editorUtils'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  { content: '' }
)

const attrs = useAttrs()

const rootRef = useTemplateRef('root')

watch(
  () => [props.content, rootRef.value],
  () => {
    nextTick(() => {
      if (rootRef.value) fixEditorContent(rootRef.value)
    })
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <div ref="root" v-bind="attrs" v-html="content" />
</template>

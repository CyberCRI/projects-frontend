<script setup lang="ts">
import fixEditorContent from '~/functs/editorUtils'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  { content: '' }
)

const attrs = useAttrs()

const wrapper = ref(null)

watch(
  () => [props.content, wrapper.value],
  () => {
    nextTick(() => {
      if (wrapper.value) fixEditorContent(wrapper.value)
    })
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <div ref="wrapper" v-bind="attrs" v-html="content" />
</template>

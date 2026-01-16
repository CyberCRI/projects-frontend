<template>
  <svg
    ref="icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    @click="$emit('click')"
    v-html="icon"
  />
</template>

<script setup lang="ts">
import { IconImageChoice, ICONS } from '@/functs/IconImage'
const props = defineProps<{
  name: IconImageChoice
}>()

const emit = defineEmits<{
  click: []
  mounted: [SVGElement]
  unmounted: []
}>()

const icon = computed(() => {
  const content = ICONS[props.name]
  if (content) {
    return content
  }
  if (import.meta.dev) {
    throw new Error(`icon ${props.name} not exists`)
  }
  return ''
})
const el = useTemplateRef('icon')
onMounted(() => emit('mounted', el.value))
onUnmounted(() => emit('unmounted'))
</script>

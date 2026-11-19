<script lang="ts" setup>
const props = defineProps<{
  progress: number
}>()

const p = computed(() => Math.min(1, Math.max(0, props.progress)))

const path = computed(() => {
  const a = p.value * 2 * Math.PI
  const x = Math.sin(a) // starts at 12 o'clock, goes clockwise
  const y = -Math.cos(a)
  const large = p.value > 0.5 ? 1 : 0
  return `M 0 0 L 0 -1 A 1 1 0 ${large} 1 ${x} ${y} Z`
})
</script>

<template>
  <svg viewBox="-1 -1 2 2" width="24" height="24">
    <circle v-if="p >= 1" r="1" />
    <path v-else-if="p > 0" :d="path" />
  </svg>
</template>

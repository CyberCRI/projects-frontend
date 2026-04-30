<template>
  <div ref="grid" class="dynamic-grid" :class="[mode]" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'es-toolkit'
import type { StyleValue } from 'vue'

const props = withDefaults(
  defineProps<{
    minGap?: number
    mode?: 'list' | 'card'
  }>(),
  {
    minGap: 0,
    mode: 'card',
  }
)

const gridRef = useTemplateRef('grid')

// dummy non zero value
const childWidth = ref(200)
/*
  we need one instance of the function per instance of the component
  because other throttle will act globally (ie one throttle for all instances)
  and so create a mess when we have multiple instances of the component in the same page
*/
const computeColumnCount = throttle(() => {
  const width = gridRef.value?.children[0]?.getBoundingClientRect()?.width
  if (width) {
    childWidth.value = width
  }
}, 50)

const gridStyle = computed<StyleValue>(() => {
  if (props.mode === 'card') {
    return {
      'grid-template-columns': `repeat(auto-fill, ${childWidth.value}px)`,
      gap: `${props.minGap}px`,
    }
  }
  return {}
})

watch(
  () => props.mode,
  () => {
    nextTick(computeColumnCount)
  }
)

onMounted(() => {
  if (!import.meta.client) return
  computeColumnCount()
  window.addEventListener('resize', computeColumnCount)
})

onBeforeMount(() => {
  if (!import.meta.client) return
  window.removeEventListener('resize', computeColumnCount)
})
</script>
<style lang="scss" scoped>
.dynamic-grid.card {
  display: grid;
}

.dynamic-grid.list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  max-width: 60rem;
  margin: 0 auto;
}
</style>

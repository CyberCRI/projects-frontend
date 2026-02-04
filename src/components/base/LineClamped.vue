<script setup>
import { throttle } from 'es-toolkit'

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  lineNumber: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['overflow-state'])

const style = computed(() => ({
  '--line-clamp': props.lineNumber,
}))

const containerRef = ref(null)

const isOverflowing = ref(false)

function checkOverflowing() {
  const element = containerRef.value
  if (!element) return false
  const { width, height } = element.getBoundingClientRect()
  const styles = getComputedStyle(element)
  const lineHeight = parseFloat(styles.lineHeight)
  const lineClamp = parseInt(styles.webkitLineClamp || '0')
  console.log('lineHeight', lineHeight, 'lineClamp', lineClamp)

  // for some reason scollHeight is sometime just a few pixel large that height - hence this fix
  let isOverflowingHeight = element.scrollHeight > Math.ceil(height)
  if (lineHeight && lineClamp) {
    const desiredLines = Math.round(element.scrollHeight / lineHeight)
    isOverflowingHeight = desiredLines > lineClamp
  }

  const isOverflowingWidth = element.scrollWidth > Math.ceil(width)

  isOverflowing.value = isOverflowingHeight || isOverflowingWidth
}

const throttledCheckOverflowing = throttle(checkOverflowing, 1000 / 30)

watch(
  () => props.lineNumber,
  () => {
    checkOverflowing()
  }
)

watch(
  () => isOverflowing.value,
  (neo, old) => {
    if (neo !== old) emit('overflow-state', neo)
  },
  { immediate: true }
)

onMounted(() => {
  checkOverflowing()
  window.addEventListener('resize', throttledCheckOverflowing)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', throttledCheckOverflowing)
})

onUpdated(() => {
  checkOverflowing()
})
</script>
<template>
  <component
    :is="tag"
    ref="containerRef"
    class="line-clamped"
    :style="style"
    :class="{ overflowing: isOverflowing }"
  >
    <slot />
  </component>
</template>
<style>
.line-clamped {
  display: -webkit-box;
  -webkit-line-clamp: var(--line-clamp);
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

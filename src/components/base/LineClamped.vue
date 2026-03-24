<template>
  <component :is="tag" ref="container" class="line-clamped" :class="{ overflowing: isOverflowing }">
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tag?: string
    lineNumber?: number
  }>(),
  {
    tag: 'div',
    lineNumber: 1,
  }
)
const emit = defineEmits<{
  overflowState: [boolean]
}>()

const containerRef = useTemplateRef<HTMLElement>('container')
const isOverflowing = ref(false)

const checkOverflowing = () => {
  const element = containerRef.value
  if (!element) return

  const { width, height } = element.getBoundingClientRect()
  const styles = getComputedStyle(element)
  const lineHeight = parseFloat(styles.lineHeight)
  const lineClamp = parseInt(styles.webkitLineClamp || '0')

  // for some reason scollHeight is sometime just a few pixel large that height - hence this fix
  let isOverflowingHeight = element.scrollHeight > Math.ceil(height)
  if (lineHeight && lineClamp) {
    const desiredLines = Math.round(element.scrollHeight / lineHeight)
    isOverflowingHeight = desiredLines > lineClamp
  }

  const isOverflowingWidth = element.scrollWidth > Math.ceil(width)
  isOverflowing.value = isOverflowingHeight || isOverflowingWidth
}

watch(() => props.lineNumber, checkOverflowing)

watchEffect(() => emit('overflowState', isOverflowing.value))
onResizeElement(checkOverflowing, containerRef)
</script>

<style>
.line-clamped {
  display: -webkit-box;
  -webkit-line-clamp: v-bind('lineNumber');
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

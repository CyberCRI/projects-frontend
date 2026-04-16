<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string
    maxLength: number
  }>(),
  {
    text: '',
  }
)

const currentLength = computed(() => props.text?.length || 0)
const maxReached = computed(() => currentLength.value >= props.maxLength)
</script>

<template>
  <p class="char-counter" :class="{ 'is-at-max': maxReached }">
    {{ currentLength }}/{{ maxLength }}
  </p>
</template>

<style lang="scss" scoped>
.char-counter {
  font-size: 0.75rem;
  color: $mid-gray;
  text-align: right;

  &.is-at-max {
    color: $red;
  }
}
</style>

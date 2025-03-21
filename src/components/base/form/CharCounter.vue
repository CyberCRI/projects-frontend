<script setup>
import { computed } from 'vue'
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    required: true,
  },
})
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

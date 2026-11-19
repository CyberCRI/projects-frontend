<script setup lang="ts">
import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    icon?: IconImageChoice
    description?: string
  }>(),
  { icon: 'HelpCircle', description: null }
)
</script>

<template>
  <p class="content-visibility skeletons-background">
    <IconImage :name="icon" class="icon" />
    <slot>
      <span class="p2">{{ description }}</span>
    </slot>
  </p>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.content-visibility {
  opacity: 0.7;
  padding: 1rem 0;
}
</style>

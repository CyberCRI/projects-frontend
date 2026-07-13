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
    <slot>{{ description }}</slot>
  </p>
</template>

<style lang="scss" scoped>
.content-visibility {
  opacity: 0.7;
  padding: 1rem 0;
}
</style>

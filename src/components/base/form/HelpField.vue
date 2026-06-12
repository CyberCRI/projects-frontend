<script setup lang="ts">
import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    icon?: IconImageChoice
    description: string
  }>(),
  { icon: 'HelpCircle' }
)
</script>

<template>
  <p class="content-visibility">
    <IconImage :name="icon" class="icon" />
    {{ description }}
  </p>
</template>

<style lang="scss" scoped>
.content-visibility {
  opacity: 0.7;
  padding: 1rem 0;
}
</style>

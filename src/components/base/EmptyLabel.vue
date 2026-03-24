<template>
  <div class="empty skeletons-text">
    {{ label || $t('common.empty') }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: null,
  }
)
</script>

<style scoped>
.empty {
  text-align: center;
  font-style: italic;
  opacity: 0.5;
}
</style>

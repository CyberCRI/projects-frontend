<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <BadgeItem icon-name="InfoCardLine" :label="label" />
</template>

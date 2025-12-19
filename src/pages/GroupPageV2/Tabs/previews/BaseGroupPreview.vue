<template>
  <div class="group">
    <div class="group-header">
      <h2 class="title">{{ title }} ( {{ total }} )</h2>
      <SeeMoreArrow v-if="!loading" class="see-more-button" :to="seeMore" />
    </div>

    <div class="group-container">
      <slot v-if="loading" name="skeleton" />
      <slot v-else name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  total: number
  seeMore: any
  loading: boolean
}>()
</script>

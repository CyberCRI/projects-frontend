<template>
  <TipTapOutput :content="content" class="cropped" />
</template>

<script setup lang="ts">
defineProps<{
  content: string
  // max line to show
  line: number
}>()
</script>

<style lang="scss" scoped>
.cropped {
  display: -webkit-box;
  -webkit-line-clamp: v-bind('line');
  line-clamp: v-bind('line');
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
</style>

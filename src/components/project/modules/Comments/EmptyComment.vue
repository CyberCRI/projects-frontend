<script setup lang="ts">
const image = usePublicURL(`/empties/emptybubble.png`)
</script>

<template>
  <div class="no-item">
    <EmptyLabel class="message" :label="$t('comment.no-comments')" />
    <img class="empty-bubble skeletons-blur" :src="image" />
  </div>
</template>

<style lang="scss" scoped>
.no-item {
  padding-bottom: 100px;

  .message {
    text-align: center;
    margin: 100px 0 20px;
    color: grey;
    font-size: $font-size-m;
    font-weight: 600;
    text-transform: uppercase;
    background: transparent;
    font-style: unset;
    opacity: 1;
  }

  .empty-bubble {
    height: 200px;
    width: 200px;
    opacity: 0.8;
    margin: auto;
    object-fit: contain;
    display: block;
  }
}
</style>

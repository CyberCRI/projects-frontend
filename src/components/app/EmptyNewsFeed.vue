<script setup>
//NADA
</script>
<template>
  <p class="no-news">
    {{ $t('feed.empty') }}
  </p>
</template>
<style scoped lang="scss">
.no-news {
  text-align: center;
  font-size: $font-size-l;
  margin-top: $space-xl;
  font-style: italic;
  background: $primary-lighter;
  color: $almost-black;
  padding: $space-xl $space-l;
  border-radius: $border-radius-m;
}
</style>

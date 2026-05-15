<script setup lang="ts">
defineProps<{
  title: string
  notice?: string
}>()
</script>

<template>
  <div class="page-container">
    <div class="header">
      <h1>{{ title }}</h1>
      <p v-if="notice">
        {{ notice }}
        <slot name="notice" />
      </p>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  max-width: pxToRem(532px);
  margin: $navbar-height auto 0 auto;
  padding: 0 $space-l;
  box-sizing: border-box;
}

.header {
  margin-top: pxToRem(110px);
  margin-bottom: $space-xl;

  h1 {
    font-size: $font-size-5xl;
    font-weight: 700;
    text-align: center;
  }

  p {
    font-size: $font-size-m;
    margin: $space-xl 0;
  }
}
</style>

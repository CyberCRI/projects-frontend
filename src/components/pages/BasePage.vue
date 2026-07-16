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
@use '~/design/scss/variables';

.page-container {
  width: 100%;
  max-width: variables.pxtorem(532px);
  margin: variables.$navbar-height auto 0 auto;
  padding: 0 variables.$space-l;
  box-sizing: border-box;
}

.header {
  margin-top: variables.pxtorem(110px);
  margin-bottom: variables.$space-xl;

  h1 {
    font-size: variables.$font-size-5xl;
    font-weight: 700;
    text-align: center;
  }

  p {
    font-size: variables.$font-size-m;
    margin: variables.$space-xl 0;
  }
}
</style>

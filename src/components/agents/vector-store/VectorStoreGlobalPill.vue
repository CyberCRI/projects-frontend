<template>
  <span class="global-pill">{{ $t('vector-store.is-global-label') }}</span>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.global-pill {
  display: inline-block;
  background-color: variables.$primary-dark;
  color: variables.$white;
  padding: 4px;
  border-radius: 4px;
}
</style>

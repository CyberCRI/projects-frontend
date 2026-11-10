<template>
  <div class="trade-list">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.trade-list {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
}
</style>

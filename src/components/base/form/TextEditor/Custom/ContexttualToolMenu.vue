<template>
  <div class="contextual-tool-menu">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.contextual-tool-menu {
  position: relative;
  align-items: center;
  background: var(--white);
  color: variables.$white;
  display: flex;
  border: 1px solid var(--primary-dark);
  border-radius: 6px;
  padding: variables.$space-xs variables.$space-s;
  gap: variables.$space-s;
  filter: drop-shadow(0 2px 5px rgb(54 54 54 / 50%));

  :deep(.menu-item) {
    color: variables.$white;
  }
}
</style>

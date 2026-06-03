<template>
  <button class="reset-btn" type="button" rel="noopener" :aria-label="$t('pagination.next')">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  fill: $primary-dark;
  color: $primary-dark;
  font-weight: bold;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &.current,
  &:hover {
    background: $primary-light;
    border-radius: $border-radius-l;
  }

  &:not(.current, .ellipsis):hover {
    color: $primary;
    fill: $primary;
  }

  &:not(.current, .ellipsis):active {
    color: $black;
    fill: $black;
  }
}
</style>

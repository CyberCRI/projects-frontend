<template>
  <button
    type="button"
    class="labelled-menu-item"
    :class="{ 'is-active': item.isActive ? item.isActive() : null }"
    :title="item.title"
    :disabled="item.isDisabled ? item.isDisabled() : null"
    @click="item.action"
    v-text="item.label"
  />
</template>
<script>
export default {
  name: 'TextButtonMenuItem',

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
}
</script>
<style lang="scss" scoped>
.labelled-menu-item {
  color: $white;
  background-color: $primary-dark;
  white-space: nowrap;
  border: $border-width-s solid $white;
  border-radius: $border-radius-xs;

  &.is-active,
  &:hover {
    background-color: $white;
    color: $primary-dark;
  }
}
</style>

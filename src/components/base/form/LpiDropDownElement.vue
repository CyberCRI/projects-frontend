<template>
  <li class="drop-down-menu-item">
    <slot name="default" :option="option" :selected="selected" />
    <ul class="sub-list">
      <LpiProjectDropDownElement
        v-for="child in option.children"
        :key="child.id"
        :category="child"
        :selected="selected"
      >
        <template #default="{ option: child_, selected: _selected }">
          <slot name="default" :option="child_" :selected="_selected" />
        </template>
      </LpiProjectDropDownElement>
    </ul>
  </li>
</template>

<script setup>
defineOptions({
  name: 'LpiDropDownElement',
})

defineProps({
  option: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.drop-down-menu-item {
  position: relative;

  .drop-down-menu-item-content {
    color: $primary-dark;
    padding: $space-m $space-s;
    font-size: $font-size-s;
    display: flex;
    align-items: center;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;

    .label {
      transform-origin: left center;
      transition: transform 200ms ease-in-out;
      font-weight: 400;
      font-size: $font-size-m;
    }

    &:hover {
      background-color: $primary-light;

      .label {
        transform: scaleX(1.1);
      }
    }
  }
}

.sub-list {
  margin-left: 2ex;
}
</style>

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
        <template #default="{ option: subOption, selected: subSelected }">
          <slot name="default" :option="subOption" :selected="subSelected" />
        </template>
      </LpiProjectDropDownElement>
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { Option } from '~/components/base/form/LpiDropDownElementButton.vue'

type Options = {
  children: Option[]
}

withDefaults(
  defineProps<{
    option: Options
    selected?: boolean
  }>(),
  {
    selected: false,
  }
)
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
      transform: translateZ(0);
    }

    &:hover {
      background-color: $primary-light;

      .label {
        transform: translateZ(0) scaleX(1.1);
      }
    }
  }
}

.sub-list {
  margin-left: 2ex;
}
</style>

<template>
  <ToolTip
    arrow
    class="color-tip"
    :hover="true"
    :interactive="false"
    :disabled="!names || names?.length < 2"
    secondary
    placement="bottom"
  >
    <div
      :class="{
        'is-selected': isSelected,
        'is-unused': isUnused,
        'is-hidden': isHidden,
      }"
      class="filter-button"
      @click.stop.prevent="$emit('main-action')"
    >
      {{ label }}
      <ContextActionButton
        v-if="isSelected"
        class="icon-ctn extra-small"
        action-icon="Close"
        @click.stop.prevent="$emit('clear-action')"
      />
    </div>
    <template #custom-content>
      <div class="tooltip-div">
        <ul class="list-ctn">
          <li v-for="name in filteredNames" :key="name" class="item">
            {{ name }}
          </li>
        </ul>
      </div>
    </template>
  </ToolTip>
</template>

<script setup lang="ts">
import ContextActionButton from '~/components/base/button/ContextActionButton.vue'
import ToolTip from '~/components/base/ToolTip.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    isSelected?: boolean
    isHidden?: boolean
    isUnused?: boolean
    names?: string[]
  }>(),
  {
    label: null,
    isSelected: false,
    isHidden: false,
    isUnused: false,
    names: () => [],
  }
)

defineEmits<{
  'clear-action': []
  'main-action': []
}>()

const filteredNames = computed(() => {
  if (!props.names?.length) return []
  if (props.names.length < 10) return props.names
  return [...props.names.slice(0, 9), '...']
})
</script>
<style lang="scss" scoped>
.filter-button {
  display: flex;
  gap: $space-m;
  align-items: center;
  background: $white;
  border: $border-width-s solid $primary;
  padding: $space-s;
  height: min-content;
  box-sizing: border-box;
  border-radius: $border-radius-l;
  text-transform: uppercase;
  font-size: $font-size-s;
  color: $primary-dark;
  line-height: $line-height-squashed;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &.is-selected {
    font-weight: 700;
    border: $border-width-s solid $primary-dark;
  }

  &.is-hidden {
    display: none;
  }

  &.is-unused {
    background: transparent;
    border: $border-width-s solid $primary;
  }

  .icon-ctn {
    flex-shrink: 0;
  }
}

.tooltip-div {
  padding: 1rem;

  ul {
    list-style: square;
    padding-left: 1rem;
  }
}
</style>

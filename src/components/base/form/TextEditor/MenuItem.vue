<template>
  <button
    type="button"
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive() : null }"
    :title="$t(title)"
    :disabled="isDisabled || null"
    :data-test="`button-tiptap-${title}`"
    @click="action"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script>
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

export default {
  name: 'MenuItem',

  props: {
    icon: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    action: {
      type: Function,
      required: true,
    },

    isActive: {
      type: Function,
      default: null,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      remixiconUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: $primary-dark;
  border: none;
  background-color: transparent;
  border-radius: $border-radius-s;
  padding: pxToRem(4px);
  margin-right: $space-2xs;

  svg {
    width: 100%;
    height: 100%;
    fill: currentcolor;
  }

  &.is-active,
  &:hover {
    background-color: $primary-dark;

    svg {
      fill: $white;
    }
  }
}

button:disabled,
button[disabled] {
  opacity: 0.33;
  pointer-events: none;
  user-select: none;

  svg {
    user-select: none;
    pointer-events: none;
  }
}
</style>

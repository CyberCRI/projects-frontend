<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    class="header-link"
    :class="{ underlined }"
    :data-test="dataTest"
    @click="$emit('click')"
  >
    <span class="link-label">
      <slot>
        <IconImage v-if="icon" :name="icon" class="icon" :class="{ rounded: roundedIcon }" />
        {{ label }}
      </slot>
    </span>
  </component>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import { NuxtLink } from '#components'
export default {
  name: 'HeaderLink',

  components: {
    IconImage,
    NuxtLink,
  },

  props: {
    label: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: null,
    },

    routes: {
      type: Array,
      default: null,
    },

    roundedIcon: {
      type: Boolean,
      default: false,
    },
    dataTest: {
      type: String,
      default: null,
    },
    to: {
      type: [String, Object],
      default: null,
    },
  },

  emits: ['click'],

  computed: {
    underlined() {
      return this.routes && this.routes.length && this.routes.includes(this.$route.name)
    },
  },
}
</script>

<style lang="scss" scoped>
.header-link,
button.header-link,
a.header-link:visited {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $space-m $space-l;
  font-weight: 700;
  font-size: $font-size-m;
  cursor: pointer;
  will-change: transform;
  overflow: hidden;
  background-color: transparent;
  color: $primary-dark;
  border: 0 none;
  text-transform: uppercase;

  .link-label {
    display: flex;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: pxToRem(6px);
      background-color: $primary-dark;
      bottom: pxToRem(-8px);
      transform: translateZ(0) scale(0);
      transition: transform 0.15s ease-in-out;
    }
  }

  .icon {
    margin-right: $space-s;
    height: pxToRem(18px);
    fill: $primary-dark;

    &.rounded {
      fill: $white;
      background-color: $primary-dark;
      border-radius: pxToRem(9px);
    }
  }

  &.underlined,
  &:hover {
    opacity: 1;
    position: relative;

    & .link-label::after {
      transform: translateZ(0) scale(1);
    }
  }
}
</style>

<template>
  <button
    class="external-btn"
    :class="{
      'reversed-order': reversedOrder,
      'vertical-layout': verticalLayout,
      'has-border': hasBorder,
      'label-on-hover': labelOnHover,
    }"
  >
    <div v-if="btnIcon" class="over-button">
      <IconImage :name="btnIcon" class="btn" />
      <span v-if="nbButton" class="number over">
        <span>{{ nbButton }}</span>
      </span>
    </div>

    <span v-if="label" data-test="button-label" class="label">{{ label }}</span>
  </button>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
  name: 'ExternalLabelButton',

  components: {
    IconImage,
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    btnIcon: {
      type: String,
      default: null,
    },

    verticalLayout: {
      type: Boolean,
      default: false,
    },

    reversedOrder: {
      type: Boolean,
      default: false,
    },

    hasBorder: {
      type: Boolean,
      default: false,
    },

    nbButton: {
      type: String,
      default: null,
    },
    labelOnHover: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.external-btn {
  display: inline-flex;
  flex-direction: row;
  gap: $space-s;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: $primary-dark;
  cursor: pointer;

  &.reversed {
    flex-direction: row-reverse;
  }

  &.vertical-layout {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.reversed-order {
      flex-direction: column-reverse;
    }
  }

  .label {
    font-size: $font-size-s;
    font-weight: 400;
    color: $primary-dark;
    text-align: center;
  }

  .number {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-2xs;
    padding: $space-s;
    height: 7px;
    width: 7px;
    box-sizing: border-box;
    background: $primary-dark;
    color: $white;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 0;

    @media screen and (max-width: $min-tablet) {
      right: 400px; // TODO: ???
    }
  }

  .btn-label {
    font-weight: 700;
  }

  .btn {
    width: var(--external-button-outer-size, 2rem);
    height: var(--external-button-outer-size, 2rem);
    color: $primary-dark;
    fill: $primary-dark;
  }

  &.has-border {
    .over-button {
      border: $border-width-m solid $primary-dark;
      border-radius: $border-radius-50;
      width: var(--external-button-outer-size, 2rem);
      height: var(--external-button-outer-size, 2rem);
    }

    .btn {
      width: var(--external-button-inner-size, 1.5rem);
      height: var(--external-button-inner-size, 1.5rem);
    }
  }

  .over-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .over {
      pointer-events: none;
    }
  }

  &.bg-on-hover {
    svg {
      transform-origin: center;
      transition: all 200ms ease-in-out;
      transform: translateZ(0);
    }

    &:hover {
      border-radius: 8px;
      background-color: $primary-light !important;

      svg {
        transform: translateZ(0) scale(1.1);
      }
    }
  }

  &.label-on-hover {
    padding-bottom: 1rem;
    padding-top: 1rem;
    position: relative;

    &.small-top-padding {
      padding-top: 0.5rem;
    }

    .label {
      opacity: 0;
      transition: opacity 200ms ease-in-out;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0%);
    }

    &:hover {
      .label {
        opacity: 1;
      }
    }
  }
}
</style>

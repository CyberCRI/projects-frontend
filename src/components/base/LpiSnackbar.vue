<template>
  <div :class="[type, { border }]" class="snackbar">
    <IconImage v-if="icon" class="left-icon" :name="icon" />

    <slot />

    <span v-if="closable" @click="close">
      <IconImage class="close-icon" name="Close" />
    </span>
  </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
  name: 'LpiSnackbar',

  components: {
    IconImage,
  },

  props: {
    type: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: '',
    },

    closable: {
      type: Boolean,
      default: false,
    },

    border: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.snackbar {
  padding: $space-m;
  border-radius: $border-radius-s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $black;
  box-shadow: 0 4px 4px rgb(0 0 0 / 15%);
  max-width: pxToRem(740px);

  &.success,
  &.info {
    background: $primary-light;
    border: $border-width-l solid $primary-dark;
  }

  &.error {
    background: $salmon;
    border: $border-width-l solid $salmon;
  }

  &.warning {
    background: $yellow;
    border: $border-width-l solid $yellow;
  }

  .left-icon {
    margin-right: $space-m;
    height: $layout-size-xl;
    fill: $black;
  }

  .text {
    margin-right: auto;
    font-size: $font-size-xs;
    font-weight: bold;
  }

  .close-icon {
    cursor: pointer;
    margin-left: 10px;
    height: $layout-size-xl;
    fill: $black;
  }
}
</style>

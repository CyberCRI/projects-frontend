<template>
  <IconImage v-if="btnIcon && btnIcon !== 'LoaderSimple'" :name="btnIcon" class="btn-icon" />
  <LoaderSimple v-if="btnIcon && btnIcon === 'LoaderSimple'" class="btn-icon loader" />

  <span
    v-if="label"
    data-test="button-label"
    class="label"
    :class="{ 'no-text-transform': noTextTransform }"
  >
    {{ label }}
  </span>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
  name: 'ButtonContent',

  components: {
    IconImage,
    LoaderSimple,
  },

  props: {
    label: {
      type: String,
      default: null,
    },

    btnIcon: {
      type: [String, Object],
      default: null,
    },

    noTextTransform: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  text-transform: lowercase;

  &::first-letter {
    text-transform: capitalize;
  }

  &.no-text-transform {
    text-transform: none;

    &::first-letter {
      text-transform: none;
    }
  }
}

.btn-icon {
  height: pxToRem(18px);
}

.loader-simple {
  width: 22px;
  height: 22px;

  path {
    fill: $primary-dark;
  }
}
</style>

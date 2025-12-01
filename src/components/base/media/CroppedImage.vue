<template>
  <div class="cropped-image" :class="{ contain }">
    <img
      :alt="alt"
      :src="src"
      :style="imageStyles"
      @load="$emit('load', $event)"
      @error="$emit('error', $event)"
    />
  </div>
</template>
<script>
export default {
  name: 'CroppedImage',

  props: {
    imageSizes: {
      type: Object,
      required: false,
      default: null,
    },
    src: {
      type: [String, null],
      required: true,
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
    contain: {
      type: Boolean,
      required: false,
      default: false,
    },

    ratio: {
      // crop area aspect ratio
      type: Number,
      default: 1,
    },
  },

  emits: ['load', 'error'],

  computed: {
    imageStyles() {
      if (this.imageSizes) {
        return {
          width: this.ratio >= this.imageSizes.naturalRatio ? '100%' : 'auto',
          height: this.ratio < this.imageSizes.naturalRatio ? '100%' : 'auto',
          'object-fit': 'unset',
          'object-position': 'unset',
          transform: `translateZ(0)  scale(${this.imageSizes.scaleX}, ${this.imageSizes.scaleY}) translate(${this.imageSizes.left}%, ${this.imageSizes.top}%)`,
          position: 'absolute',
          top: 0,
          left: 0,
          'transform-origin': 'top left',
        }
      } else {
        return {
          transform: `translateZ(0) translate(0,0) scale(1,1)`,
        }
      }
    },
  },

  mounted() {
    // chrome doesn't trigger error on null src so do it manually
    if (!this.src) this.$emit('error', new Error('src is null'))
  },
}
</script>
<style lang="scss" scoped>
.cropped-image {
  // higher specificity to override BasicCard styles
  overflow: hidden;
  display: flex; // needed for contained image white background not to cover the whole container
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    object-fit: cover;
    object-position: center;
    background-color: $white; // request of Wien University for transparent images
    flex-grow: 1;
    flex-basis: 0; // so image take minimum space possible to cover conbtainer
  }

  &.contain {
    align-items: center;

    img {
      object-fit: contain;
    }
  }
}
</style>

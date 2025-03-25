<template>
  <div ref="grid" class="dynamic-grid" :style="gridStyle">
    <slot />
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  name: 'DynamicGrid',

  props: {
    minGap: {
      type: Number,
      default: 0,
    },
  },

  data() {
    /*
            we need one instance of the function per instance of the component
            because other throttle will act globally (ie one throttle for all instances)
            and so create a mess when we have multiple instances of the component in the same page
        */
    const _computeColumnCount = () => {
      const childWidth = this.$refs.grid?.children[0]?.getBoundingClientRect()?.width
      if (childWidth) {
        this.childWidth = childWidth
      }
    }
    return {
      childWidth: 200, // dummy non zero value
      computeColumnCount: throttle(_computeColumnCount, 50),
    }
  },

  computed: {
    gridStyle() {
      return {
        'grid-template-columns': `repeat(auto-fill, ${this.childWidth}px)`,
        gap: `${this.minGap}px`,
      }
    },
  },

  mounted() {
    this.computeColumnCount()
    window.addEventListener('resize', this.computeColumnCount)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.computeColumnCount)
  },
}
</script>
<style lang="scss" scoped>
.dynamic-grid {
  display: grid;
}
</style>

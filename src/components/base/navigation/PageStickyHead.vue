<template>
  <aside class="page-sticky-head">
    <h1 v-if="isHeaderSticked" class="page-title-recall">
      {{ pageTitle }}
    </h1>
    <slot
      :anchor-offset="anchorOffset"
      :is-header-sticked="isHeaderSticked"
      :compute-anchor-offset="computeAnchorOffset"
    ></slot>
  </aside>
</template>
<script>
import throttle from 'lodash.throttle'

export default {
  name: 'PageStickyHead',

  props: {
    pageTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      anchorOffset: 0,
      isHeaderSticked: false,
    }
  },
  mounted() {
    this.computeAnchorOffset()
    // in unit tests, window might be undefined
    window?.addEventListener('resize', this.computeAnchorOffset)
    window?.addEventListener('resize', this.checkIfSummaryIsSticked)
    window?.addEventListener('scroll', this.checkIfSummaryIsSticked)
  },
  beforeUnmount() {
    // in unit tests, window might be undefined
    window?.removeEventListener('resize', this.computeAnchorOffset)
    window?.addEventListener('resize', this.checkIfSummaryIsSticked)
    window?.addEventListener('scroll', this.checkIfSummaryIsSticked)
  },
  methods: {
    computeAnchorOffset: throttle(function () {
      if (!this) return // safeguard for debounced behavior when the component is unmounted
      const aside = this?.$el
      const asideHeight = aside ? aside.offsetHeight : 0
      const anchorOffset = asideHeight + 20 /* ??? */
      this.anchorOffset = anchorOffset
    }, 100),

    checkIfSummaryIsSticked: throttle(function () {
      const header = this.$el
      this.isHeaderSticked =
        header?.getBoundingClientRect().top <= 50 /* $navbar-height */ &&
        window?.innerWidth > 768 /* $min-tablet */
    }, 16),
  },
}
</script>
<style scoped lang="scss">
aside {
  padding: $space-m 0;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  background-color: rgb(255 255 255 / 70%);
  position: sticky;
  z-index: 100;
  top: $navbar-height;
}

.page-title-recall {
  flex-grow: 1;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: $font-size-2xl;
}
</style>

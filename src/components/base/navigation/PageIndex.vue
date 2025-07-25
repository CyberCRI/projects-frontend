<template>
  <div class="summary" :class="{ 'is-open': open }">
    <div class="summary-header" @click="toggle">
      {{ $t('common.index') }}
      <IconImage class="chevron" :name="open ? 'ChevronUp' : 'ChevronDown'" />
    </div>

    <div v-show="open" class="body custom-scrollbar">
      <slot :close-summary="close"></slot>
    </div>
  </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
export default {
  name: 'PageIndex',

  components: { IconImage },

  data() {
    return {
      open: false,
    }
  },

  methods: {
    toggle() {
      this.open = !this.open
    },
    close() {
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.chevron {
  width: 2rem;
  fill: $black;
  display: inline-block;
}

.summary {
  background: $primary-lighter;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
  position: relative;
  overflow: visible;
  width: 280px;

  @media screen and (min-width: $min-tablet) {
    width: 378px;
  }

  .summary-header {
    padding: $space-xs $space-l;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  &.is-open .summary-header {
    padding-bottom: $space-l;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: $primary;
  }

  .body {
    background: $primary-lighter;
    border-radius: 0 0 $border-radius-l $border-radius-l;
    border-top: 0 solid $primary;
    border-left: $border-width-s solid $primary;
    border-right: $border-width-s solid $primary;
    border-bottom: $border-width-s solid $primary;
    position: absolute;
    transform: translateY(-1rem);
    top: 100%;
    left: -$border-width-s;
    right: -$border-width-s;
    overflow-y: scroll;
    max-height: 302px;
    padding: $space-m $space-l;
    color: $primary-dark;
  }
}
</style>

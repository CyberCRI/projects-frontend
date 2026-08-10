<template>
  <div class="summary" :class="{ 'is-open': open }">
    <div class="summary-header" @click="toggle">
      {{ $t('common.index') }}
      <IconImage class="chevron" :name="open ? 'ChevronUp' : 'ChevronDown'" />
    </div>

    <div v-show="open" class="body custom-scrollbar">
      <slot :close-summary="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.chevron {
  width: 2rem;
  fill: variables.$black;
  display: inline-block;
}

.summary {
  background: variables.$primary-lighter;
  border-radius: variables.$border-radius-l;
  border: variables.$border-width-s solid variables.$primary;
  position: relative;
  overflow: visible;
  width: 280px;

  @media screen and (min-width: variables.$min-tablet) {
    width: 378px;
  }

  .summary-header {
    padding: variables.$space-xs variables.$space-l;
    font-size: variables.$font-size-l;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: variables.$almost-black;
  }

  &.is-open .summary-header {
    padding-bottom: variables.$space-l;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: variables.$primary;
  }

  .body {
    background: variables.$primary-lighter;
    border-radius: 0 0 variables.$border-radius-l variables.$border-radius-l;
    border-top: 0 solid variables.$primary;
    border-left: variables.$border-width-s solid variables.$primary;
    border-right: variables.$border-width-s solid variables.$primary;
    border-bottom: variables.$border-width-s solid variables.$primary;
    position: absolute;
    transform: translateY(-1rem);
    top: 100%;
    left: -(variables.$border-width-s);
    right: -(variables.$border-width-s);
    overflow-y: scroll;
    max-height: 302px;
    padding: variables.$space-m variables.$space-l;
    color: variables.$primary-dark;
  }
}
</style>

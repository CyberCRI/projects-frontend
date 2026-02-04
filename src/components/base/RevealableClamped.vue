<template>
  <div class="revealable-clamped">
    <LineClamped
      v-if="textContent"
      class="text-limited"
      :tag="tag"
      :line-number="lineNumber"
      :style="styleLimited"
      @overflow-state="isClamped = $event"
    >
      {{ textContent }}
    </LineClamped>
    <IconImage v-if="isClamped" class="icon" name="ChevronDown" @click="showFull = !showFull" />
    <div v-if="isClamped && showFull" class="revealable-full">
      <component :is="tag" :style="styleFull" class="text-full">
        {{ textContent }}
      </component>
      <IconImage class="icon icon-open" name="ChevronUp" @click="showFull = !showFull" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  textContent: {
    type: String,
    required: true,
  },
  lineNumber: {
    type: Number,
    required: false,
    default: 1,
  },
  tag: {
    type: String,
    required: false,
    default: 'div',
  },
  styleLimited: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  styleFull: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const showFull = ref(false)
const isClamped = ref(false)
</script>
<style scoped lang="scss">
.revealable-clamped {
  position: relative;
  width: 100%;
}

.revealable-full {
  $pad: $space-m;
  position: absolute;
  top: -$pad;
  left: -$pad;
  background-color: $white;
  box-shadow: 0 0 6px rgb(0 0 0 / 15%);
  border-radius: 16px;
  padding: $pad;
  display: flex;
  align-items: center;
  z-index: 1;
  min-height: calc(100% + #{$pad});
  min-width: calc(100% + #{$pad});
}

.revealable-clamped {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}

.full-purpose {
  font-weight: 400;
  font-size: $font-size-m;
}

.icon {
  width: 24px;
  fill: $white;
  cursor: pointer;
  border: 1px solid $primary-dark;
  border-radius: 50%;
  background-color: $primary-dark;
}

.icon-open {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>

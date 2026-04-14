<template>
  <div class="revealable-clamped">
    <LineClamped
      :is="is"
      v-if="textContent"
      class="text-limited"
      :line-number="lineNumber"
      :style="styleLimited"
      @overflow-state="isClamped = $event"
    >
      {{ textContent }}
    </LineClamped>
    <IconImage v-if="isClamped" class="icon" name="ChevronDown" @click="showFull = !showFull" />
    <div v-if="isClamped && showFull" class="revealable-full">
      <component :is="is" :style="styleFull" class="text-full">
        {{ textContent }}
      </component>
      <IconImage class="icon icon-open" name="ChevronUp" @click="showFull = !showFull" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { StyleValue } from 'vue'

withDefaults(
  defineProps<{
    textContent: string
    lineNumber?: number
    is?: string
    styleLimited?: StyleValue
    styleFull?: StyleValue
  }>(),
  {
    lineNumber: 1,
    is: 'div',
    styleLimited: () => ({}),
    styleFull: () => ({}),
  }
)
const showFull = ref(false)
const isClamped = ref(false)
</script>

<style scoped lang="scss">
.revealable-clamped {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
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

<template>
  <span class="researcher-trade">
    <IconImage class="icon trade-icon" :name="tradeIcon" />
    <span class="trade-label">{{ trade.label }}</span>
    <IconImage v-if="!!trade.note" name="Article" class="icon comment-icon" />
  </span>
</template>
<script lang="ts" setup>
const props = defineProps<{
  trade: { type: 'need' | 'availability'; label: string; note: string }
}>()

const tradeIcon = computed(() =>
  props.trade.type == 'need' ? 'BullhornOutline' : 'CheckCircleLine'
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.researcher-trade {
  display: inline-flex;
  padding: 0.2rem 0.4rem;
  flex-flow: row-nowrap;
  gap: 0.6rem;
  align-items: center;
  border: 1px solid variables.$light-gray;
  border-radius: 4px;
  font-size: 0.8rem;
}

.icon {
  fill: variables.$primary;
  flex-shrink: 0;

  svg {
    width: 1em;
    height: 1em;
  }
}

.trade-label {
  color: variables.$black;
  flex-shrink: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

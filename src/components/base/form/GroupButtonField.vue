<script lang="ts" generic="TValue extends string | number | boolean" setup>
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
withDefaults(
  defineProps<{ label: string; notice?: string; options: GroupOption[]; hasIcon?: boolean }>(),
  {
    notice: '',
    hasIcon: false,
  }
)
const emit = defineEmits(['update:modelValue'])
const modelValue = defineModel<TValue>()
</script>

<template>
  <div class="list-field">
    <slot name="label-left" />
    <div class="wording">
      <label class="skeletons-text">{{ label }}</label>
      <p v-if="notice" class="notice skeletons-text">
        {{ notice }}
      </p>
    </div>
    <div class="actions">
      <slot name="actions-left" />
      <GroupButton
        :model-value="modelValue"
        :options="options"
        :has-icon="hasIcon"
        size="default"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <slot name="actions-right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
@use '~/components/profile/modules/profile-form';

.list-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: variables.$border-width-s solid variables.$lighter-gray;

  .wording {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: variables.$space-unit;
    padding: variables.$space-l 0;

    &.vertical {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
    }

    &:last-child {
      border-bottom: none;
    }

    label {
      font-size: variables.$font-size-l;
      font-weight: 500;
      line-height: variables.$line-height-squashed;
    }

    .notice {
      font-size: variables.$font-size-m;
      font-weight: 400;
      line-height: variables.$line-height-squashed;
    }
  }

  .actions {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

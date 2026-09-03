<script lang="ts" setup>
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import type { PrivacyValue } from 'shared-projects-frontend/models'
defineProps<{ label: string; notice: string; options: GroupOption[]; hasIcon: boolean }>()
const emit = defineEmits(['update:modelValue'])
const modelValue = defineModel<PrivacyValue>()
</script>
<template>
  <div class="privacy-field">
    <div class="wording">
      <label>{{ label }}</label>
      <p class="notice">
        {{ notice }}
      </p>
    </div>
    <div class="actions">
      <GroupButton
        :model-value="modelValue"
        :options="options"
        :has-icon="hasIcon"
        size="default"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use '~/pages/UserProfilePageV2/Tabs/profile-form';
.privacy-field {
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

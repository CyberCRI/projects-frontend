<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

const props = withDefaults(
  defineProps<{
    label: string
    isToggleable?: boolean
    isInitialyOpen?: boolean
  }>(),
  {
    isToggleable: false,
    isInitialyOpen: false,
  }
)

const { stateModal, toggleModal } = useModal(props.isInitialyOpen)
</script>

<template>
  <div class="category-field" :class="{ 'is-toggleable': isToggleable, 'is-open': stateModal }">
    <h4 class="field-label" @click.stop="toggleModal">
      <span class="text">{{ label }}</span>
      <span v-if="isToggleable" class="toggle">
        <IconImage :name="stateModal ? 'ChevronUp' : 'ChevronDown'" />
      </span>
    </h4>
    <div v-show="!isToggleable || stateModal" class="field-content">
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.field-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: variables.$font-size-m;
  margin-bottom: variables.$space-s;

  .text {
    flex-grow: 1;
    font-weight: 500;
    color: variables.$almost-black;
  }

  .toggle {
    flex-shrink: 0;
    fill: variables.$primary-dark;
    width: 2em;
    height: 2em;
  }
}

.is-toggleable .field-label {
  cursor: pointer;
}
</style>

<template>
  <BaseModal
    :width="width"
    :height="height"
    :is-small="isSmall"
    :can-close="canClose"
    @close="close"
  >
    <template #header-title>
      <slot name="header">This is the default title!</slot>
    </template>

    <template #content>
      <div class="modal-body">
        <slot name="body">This is the default body!</slot>
      </div>
    </template>

    <!-- These buttons can be changed for future purposes -->
    <template v-if="!noFooter" #footer>
      <div class="modal-footer">
        <LpiButton
          :disabled="asyncing"
          :label="cancelButtonLabel || $t('common.cancel')"
          secondary
          class="button-footer"
          data-test="cancel-destroy"
          @click="close"
        />

        <slot v-if="$slots['extra-buttons']" name="extra-buttons" />

        <LpiButton
          v-if="!noSecondButton"
          :disabled="disabled || asyncing"
          :label="confirmButtonLabel || $t('common.confirm')"
          :btn-icon="asyncing ? 'LoaderSimple' : null"
          class="button-footer"
          data-test="confirm-destroy"
          @click="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    canClose?: boolean
    isSmall?: boolean
    asyncing?: boolean
    disabled?: boolean
    confirmButtonLabel?: string
    cancelButtonLabel?: string
    noFooter?: boolean
    noSecondButton?: boolean
  }>(),
  {
    width: null,
    height: null,
    canClose: true,
    isSmall: false,
    asyncing: false,
    disabled: false,
    confirmButtonLabel: null,
    cancelButtonLabel: null,
    noFooter: false,
    noSecondButton: false,
  }
)

const emit = defineEmits<{
  close: []
  submit: []
}>()

const close = () => emit('close')
const submit = () => {
  if (!props.disabled && !props.asyncing) {
    emit('submit')
  }
}
</script>

<style scoped lang="scss">
.modal-footer {
  display: flex;
  gap: $space-l;
}

.modal-body {
  max-height: 80vh;
}
</style>

<template>
  <DialogModal
    class="confirm-modal"
    :asyncing="asyncing"
    :no-second-button="noSecondButton"
    :cancel-button-label="cancelButtonLabel || $t('common.no')"
    :confirm-button-label="confirmButtonLabel || $t('common.yes')"
    @close="$emit('cancel')"
    @submit="$emit('confirm')"
  >
    <template #header>
      {{ title }}
    </template>
    <template #body>
      <slot>
        {{ content }}
      </slot>
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'

withDefaults(
  defineProps<{
    title?: string
    content?: string
    cancelButtonLabel?: string
    confirmButtonLabel?: string
    noSecondButton?: boolean
    asyncing?: boolean
  }>(),
  {
    title: '',
    content: '',
    cancelButtonLabel: null,
    confirmButtonLabel: null,
    noSecondButton: false,
    asyncing: false,
  }
)

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
<style lang="scss" scoped>
.confirm-modal {
  position: absolute;
}
</style>

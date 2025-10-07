<template>
  <DialogModal
    class="confirm-modal"
    :asyncing="asyncing"
    :no-second-button="noSecondButton"
    :cancel-button-label="$t(cancelButtonLabel)"
    :confirm-button-label="$t(confirmButtonLabel)"
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

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'

export default {
  name: 'ConfirmModal',

  components: { DialogModal },

  props: {
    title: {
      type: String,
      default: '',
    },

    content: {
      type: String,
      default: '',
    },

    cancelButtonLabel: {
      type: String,
      default: 'common.no',
    },

    confirmButtonLabel: {
      type: String,
      default: 'common.yes',
    },

    noSecondButton: {
      type: Boolean,
      default: false,
    },
    asyncing: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['cancel', 'confirm'],
}
</script>
<style lang="scss" scoped>
.confirm-modal {
  position: absolute;
}
</style>

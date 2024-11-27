<template>
    <DialogModal
        class="confirm-modal"
        @close="$emit('cancel')"
        @submit="$emit('confirm')"
        :asyncing="asyncing"
        :no-second-button="noSecondButton"
        :cancel-button-label="$t(cancelButtonLabel)"
        :confirm-button-label="$t(confirmButtonLabel)"
    >
        <template #header>{{ title }}</template>
        <template #body>{{ content }}</template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'

export default {
    name: 'ConfirmModal',

    emits: ['cancel', 'confirm'],

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
            default: 'common.cancel',
        },

        confirmButtonLabel: {
            type: String,
            default: 'common.delete',
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
}
</script>
<style lang="scss" scoped>
.confirm-modal {
    position: absolute;
}
</style>

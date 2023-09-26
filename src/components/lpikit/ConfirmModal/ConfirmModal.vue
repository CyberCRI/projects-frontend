<template>
    <DialogModal
        class="confirm-modal"
        @close="$emit('cancel')"
        @submit="$emit('confirm')"
        :first-button-options="{ disabled: asyncing }"
        :second-button-options="{ disabled: asyncing }"
    >
        <template #header>{{ title }}</template>
        <template #body>{{ content }}</template>
        <template v-if="hasFirstButton" #button-1>{{ $t(cancelButtonLabel) }}</template>
        <template v-if="hasSecondButton" #button-2>
            <span class="button-2-wrapper"
                ><LoaderSimple v-if="asyncing" class="loader" /> {{ $t(confirmButtonLabel) }}</span
            ></template
        >
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'

export default {
    name: 'ConfirmModal',

    emits: ['cancel', 'confirm'],

    components: { DialogModal, LoaderSimple },

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

        hasFirstButton: {
            type: Boolean,
            default: true,
        },

        hasSecondButton: {
            type: Boolean,
            default: true,
        },
        asyncing: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.button-2-wrapper {
    display: inline-flex;
    gap: $space-s;
    align-items: center;
}

.loader {
    width: pxToRem(22px);
    height: pxToRem(22px);

    path {
        fill: $white;
    }
}
</style>

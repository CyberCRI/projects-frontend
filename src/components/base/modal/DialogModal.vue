<template>
    <BaseModal
        :width="width"
        :height="height"
        :is-small="isSmall"
        @close="close"
        :can-close="canClose"
    >
        <template #header-title>
            <slot name="header"> This is the default title!</slot>
        </template>

        <template #content>
            <div class="modal-body">
                <slot name="body"> This is the default body!</slot>
            </div>
        </template>

        <!-- These buttons can be changed for future purposes -->
        <template #footer v-if="!noFooter">
            <div class="modal-footer">
                <LpiButton
                    :disabled="asyncing"
                    :label="cancelButtonLabel || $t('common.cancel')"
                    secondary
                    class="button-footer"
                    @click="close"
                    data-test="cancel-destroy"
                />

                <slot v-if="$slots['extra-buttons']" name="extra-buttons"></slot>

                <LpiButton
                    v-if="!noSecondButton"
                    :disabled="disabled || asyncing"
                    :label="confirmButtonLabel || $t('common.confirm')"
                    :btn-icon="asyncing ? 'LoaderSimple' : null"
                    class="button-footer"
                    @click="submit"
                    data-test="confirm-destroy"
                />
            </div>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'DialogModal',

    emits: ['close', 'submit'],

    components: { BaseModal, LpiButton },

    props: {
        width: {
            type: String,
            default: null,
        },

        height: {
            type: String,
            default: null,
        },

        canClose: {
            type: Boolean,
            default: true,
        },

        isSmall: {
            type: Boolean,
            default: false,
        },

        asyncing: {
            type: Boolean,
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },
        confirmButtonLabel: {
            type: String,
            default: null,
        },
        cancelButtonLabel: {
            type: String,
            default: null,
        },

        noFooter: {
            type: Boolean,
            default: false,
        },
        noSecondButton: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },

        submit() {
            if (!this.disabled && !this.asyncing) this.$emit('submit')
        },
    },
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

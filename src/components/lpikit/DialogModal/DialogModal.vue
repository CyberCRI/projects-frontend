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
        <template #footer v-if="hasFooter">
            <button
                v-bind="firstButtonOptions"
                type="button"
                class="button-footer"
                @click="close"
                aria-label="first-button"
                data-test="cancel-destroy"
            >
                <slot name="button-1"></slot>
            </button>

            <slot v-if="$slots['extra-buttons']" name="extra-buttons"></slot>

            <button
                v-if="$slots['button-2']"
                v-bind="secondButtonOptions"
                type="button"
                class="button-footer button-footer--submit"
                @click="submit"
                aria-label="second-button"
                data-test="confirm-destroy"
            >
                <slot name="button-2"></slot>
            </button>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from '@/components/lpikit/BaseModal/BaseModal.vue'

export default {
    name: 'DialogModal',

    emits: ['close', 'submit'],

    components: { BaseModal },

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

        firstButtonOptions: {
            type: Object,
            default: null,
        },

        secondButtonOptions: {
            type: Object,
            default: null,
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },

        submit() {
            this.$emit('submit')
        },
    },

    computed: {
        hasFooter() {
            return !!this.$slots['button-1'] || !!this.$slots['extra-buttons']
        },
    },
}
</script>

<style scoped lang="scss">
.modal-footer {
    display: flex;
    place-content: space-between center;

    button {
        cursor: pointer;
    }
}

.modal-body {
    max-height: 80vh;
    line-height: 1.6;
}

/* dont use deep() here beacause of a teleport (see BaseModal) weirdness with slot  */
.button-footer {
    color: $primary-dark;
    background: $white;
    padding: pxToRem(10px) pxToRem(34px);
    border: $border-width-s solid $primary-dark;
    font-weight: 700;
    border-radius: 24px;
    text-transform: capitalize;
}

/* dont use deep() here beacause of a teleport (see BaseModal) weirdness with slot  */
.button-footer--submit {
    background: $primary-dark;
    color: $white;
    margin-left: pxToRem(20px);
}

/* dont use deep() here beacause of a teleport (see BaseModal) weirdness with slot  */
.button-footer[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
}

/* dont use deep() here beacause of a teleport (see BaseModal) weirdness with slot  */
.button-footer:not([disabled]):hover {
    color: $white;
    background: $primary-dark;
}
</style>

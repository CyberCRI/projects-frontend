<template>
    <DialogModal
        @close="closeModal"
        @submit="insertLink"
        :second-button-options="secondButtonOptions"
    >
        <template #header
            >{{
                $filters.capitalize(
                    mode === 'add' ? $t('resource.add-link') : $t('resource.edit-link')
                )
            }}
        </template>

        <template #body>
            <template v-if="needText">
                <label>{{ $filters.capitalize($t('resource.add-link-text-label')) }}</label>
                <TextInput
                    v-model="text"
                    :placeholder="$filters.capitalize($t('resource.add-link-text'))"
                    data-test="input-new-link-text"
                />
            </template>
            <label>{{ $filters.capitalize($t('resource.add-link-url-label')) }}</label>
            <TextInput
                v-model="link"
                :placeholder="$filters.capitalize($t('resource.add-link-url'))"
                data-test="input-new-link"
            />
        </template>

        <template #button-1>{{ $t('common.cancel') }}</template>

        <template #extra-buttons>
            <button
                v-if="mode === 'edit'"
                type="button"
                @click="removeLink"
                class="button-footer button-delete"
                aria-label="delete-button"
                data-test="delete-link-button"
            >
                <span>{{ $t('common.delete') }}</span>
            </button>
        </template>

        <template #button-2>{{ mode === 'add' ? $t('common.add') : $t('common.edit') }}</template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'

export default {
    name: 'EditorModalLink',

    emits: ['closeModal', 'onConfirm'],

    components: { DialogModal, TextInput },

    data() {
        return {
            link: undefined,
            text: undefined,
        }
    },

    props: {
        linkHref: {
            type: String,
            default: undefined,
        },
        hasSelection: {
            type: Boolean,
            default: false,
        },
    },

    mounted() {
        this.link = this.linkHref
    },

    computed: {
        needText() {
            return !this.hasSelection && this.mode === 'add'
        },
        mode() {
            return this.linkHref !== undefined ? 'edit' : 'add'
        },
        secondButtonOptions() {
            return {
                disabled: !this.link || (this.needText && !this.text),
            }
        },
    },

    methods: {
        closeModal() {
            this.$emit('closeModal')
        },

        insertLink() {
            const data = {
                href: this.link,
            }
            if (this.needText) {
                data.text = this.text
            }
            this.$emit('onConfirm', data)
            this.closeModal()
        },

        removeLink() {
            this.$emit('onConfirm', null)
            this.closeModal()
        },
    },
}
</script>

<style lang="scss" scoped>
.button-delete {
    cursor: pointer;
    color: $white;
    background: $salmon;
    margin-left: pxToRem(16px);
    padding: $space-m pxToRem(11px);
    border: $border-width-s solid $primary-dark;
    font-weight: 700;
    border-radius: 24px;
    text-transform: capitalize;

    &:hover {
        color: $white;
        background: $primary-dark;
    }
}

label {
    display: block;
    font-weight: 400;
    font-size: $font-size-l;
    padding: $space-m 0;
}
</style>

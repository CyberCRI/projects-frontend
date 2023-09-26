<template>
    <div class="editor-modal">
        <div class="back" @click="closeModal"></div>
        <div class="popup" @click.stop>
            <div class="button-box">
                <div
                    class="button is-danger"
                    @click="confirmDestroy"
                    v-text="$t('common.close')"
                    data-test="button-draft-button-destroy"
                ></div>
                <div
                    class="button is-warning"
                    @click="closeModal"
                    v-text="$t('common.cancel')"
                    data-test="button-draft-button-cancel"
                ></div>
            </div>
            <div class="content">
                <p>{{ $t('description.delete') }}</p>
                <p>{{ $t('description.edit-saved') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditorModalDestroy',

    emits: ['close-modal', 'on-confirm'],

    methods: {
        closeModal() {
            this.$emit('close-modal')
        },

        confirmDestroy() {
            this.$emit('on-confirm')
        },
    },
}
</script>

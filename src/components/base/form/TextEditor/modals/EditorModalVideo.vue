<template>
    <DialogModal
        @close="closeModal"
        @submit="insertVideo"
        :second-button-options="secondButtonOptions"
    >
        <template #header>{{ $filters.capitalize($t('file.add-video')) }}</template>

        <template #body>
            <TextInput
                v-model="videoSrc"
                :placeholder="$filters.capitalize($t('resource.add-link'))"
                data-test="input-video-link"
                class="text-input"
            />

            <LpiSnackbar type="info" icon="QuestionMark">
                <div v-html="$t('file.add-video-hint')"></div>
            </LpiSnackbar>
        </template>

        <template #button-1>{{ $t('common.cancel') }}</template>

        <template #button-2>{{ $t('common.confirm') }}</template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import TextInput from '@/components/base/form/TextInput.vue'

export default {
    name: 'EditorModalVideo',

    emits: ['closeModal', 'onConfirm'],

    components: { DialogModal, LpiSnackbar, TextInput },

    data() {
        return {
            videoSrc: '',
        }
    },

    computed: {
        validVideo() {
            return this.videoSrc.match(/youtu\.be|youtube|vimeo/)
        },
        secondButtonOptions() {
            return {
                disabled: !this.videoSrc || !this.validVideo,
            }
        },
    },

    methods: {
        closeModal() {
            this.$emit('closeModal')
        },

        insertVideo() {
            if (this.validVideo) {
                this.$emit('onConfirm', { src: this.videoSrc })
                this.videoSrc = ''
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.text-input {
    margin-bottom: $space-l;
}
</style>

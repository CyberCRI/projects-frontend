<template>
    <DialogModal
        @close="closeModal"
        @submit="insertImage"
        :second-button-options="secondButtonOptions"
    >
        <template #header>{{ $filters.capitalize($t('file.add-image')) }}</template>

        <template #body>
            <img :src="displayedImage" />

            <ImageInput
                id="editor-image"
                :label="$t('project.form.upload-image')"
                class="image-input"
                @upload-image="fileChange"
            />
        </template>

        <template #button-1>{{ $t('common.cancel') }}</template>

        <template #button-2>{{ $t('common.confirm') }}</template>
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'

const MAX_FILE_SIZE = Number(import.meta.env.VITE_APP_MAX_SIZE_FILE) || 5000000 // 5MB

export default {
    name: 'EditorModalImage',

    emits: ['closeModal', 'onConfirm', 'image'],

    components: { DialogModal, ImageInput },

    computed: {
        validImage() {
            return this.validImageExtension && this.validImageSize
        },

        validImageExtension() {
            return this.imageSrc.match(/\.(jpeg|jpg|gif|png|jfif|webp)$/i) != null
        },

        validImageSize() {
            return this.file && this.file.size < MAX_FILE_SIZE
        },

        isFaqImage() {
            return this.$route.name === 'faq'
        },

        isTemplateImage() {
            return this.$route.name === 'templates'
        },

        isProjectView() {
            return this.$route.path.split('/')[1] === 'projects'
        },

        isBlogEntryImage() {
            return this.parent === 'blog-entry'
        },

        isCommentImage() {
            return this.parent === 'comments'
        },

        secondButtonOptions() {
            return {
                disabled: !this.file,
            }
        },
        isOrganization() {
            return this.parent === 'organization'
        },
    },

    props: {
        parent: {
            type: String,
            default: '',
        },

        saveImageCallback: {
            // function must take a file argument and return a promise resolving to an {url, width, height} object
            type: [Function, null],
            required: false,
            default: null,
        },
    },

    data() {
        return {
            imageSrc: '',
            file: undefined,
            uploading: false,
            displayedImage: undefined,
        }
    },

    methods: {
        closeModal() {
            this.imageSrc = ''
            this.$emit('closeModal')
        },

        fileChange(image) {
            const sizeMax = MAX_FILE_SIZE / 1000 / 1000
            this.file = image
            this.imageSrc = this.file.name

            if (!this.validImageExtension) {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('resource.invalid-image'),
                    type: 'error',
                })
                this.imageSrc = ''
                this.$emit('closeModal')
                return
            }

            if (!this.validImageSize) {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t(`crikit.errors.too-big-file-size`, { sizeMax }),
                    type: 'error',
                })
                this.imageSrc = ''
                this.$emit('closeModal')
                return
            }

            this.displayedImage = undefined

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }
        },

        insertImage() {
            if (!this.validImage) return
            if (!this.saveImageCallback) {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('resource.cannot-upload-image'),
                    type: 'error',
                })
                console.error('saveImageCallback is not defined')
            } else {
                this.uploading = true
                this.saveImageCallback(this.file)
                    .then((image) => {
                        this.$emit('onConfirm', image)
                        this.$nextTick(() => {
                            this.$emit('image', image)
                            this.closeModal()
                        })
                    })
                    .catch(() => {
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('resource.error-uploading-image'),
                            type: 'error',
                        })
                    })
            }

            this.uploading = false
        },
    },
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    margin-bottom: $space-s;
}

.image-input {
    margin: 0 auto;
}
</style>

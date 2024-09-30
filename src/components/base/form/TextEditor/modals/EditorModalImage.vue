<template>
    <DialogModal
        @close="closeModal"
        @submit="insertImage"
        :confirm-button-label="$t('common.confirm')"
        :cancel-button-label="$t('common.cancel')"
        :disabled="!file"
        :asyncing="uploading"
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
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'
import useToasterStore from '@/stores/useToaster.ts'

const MAX_FILE_SIZE = Number(import.meta.env.VITE_APP_MAX_SIZE_FILE) || 5000000 // 5MB

export default {
    name: 'EditorModalImage',

    emits: ['closeModal', 'image'],

    components: { DialogModal, ImageInput },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    data() {
        return {
            imageSrc: '',
            file: undefined,
            uploading: false,
            displayedImage: undefined,
        }
    },

    props: {
        saveImageCallback: {
            // function must take a file argument and return a promise resolving to an {url, width, height} object
            type: [Function, null],
            required: false,
            default: null,
        },
        editor: {
            type: Object,
            required: true,
        },
    },

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
                this.toaster.pushError(this.$t('resource.invalid-image'))
                this.closeModal()
                return
            }

            if (!this.validImageSize) {
                this.toaster.pushError(this.$t(`crikit.errors.too-big-file-size`, { sizeMax }))
                this.icloseModal()
                return
            }

            this.displayedImage = undefined

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }
        },

        async insertImage() {
            if (!this.validImage) return
            if (!this.saveImageCallback) {
                this.toaster.pushError(this.$t('resource.cannot-upload-image'))
                console.error('saveImageCallback is not defined')
            } else {
                this.uploading = true
                try {
                    const image = await this.saveImageCallback(this.file)
                    this.handleImageModalConfirmed(image)
                    this.$nextTick(() => {
                        this.$emit('image', image)
                        this.closeModal()
                    })
                    this.uploading = false
                } catch (_e) {
                    this.toaster.pushError(this.$t('resource.error-uploading-image'))
                    this.uploading = false
                }
            }
        },

        handleImageModalConfirmed(img) {
            const MAX_SIZE = 1100
            const attrsw = img.width < MAX_SIZE ? img.width : MAX_SIZE
            const attrsh =
                img.height < MAX_SIZE ? img.height : img.height * (MAX_SIZE / parseFloat(img.width))

            this.editor
                .chain()
                .focus()
                .setImage({
                    src: img.static_url,
                    width: attrsw,
                    height: attrsh,
                })
                .run()
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

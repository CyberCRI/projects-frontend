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
import { postProjectImage } from '@/api/projects.service'
import { postFaqImage } from '@/api/faqs.service'
import { postTemplateImage } from '@/api/templates.service'
import { postBlogEntryImage } from '@/api/blogentries.service'
import { postCommentImage } from '@/api/comments.service'
import { postOrganizationImage } from '@/api/organizations.service'
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

        currentProjectId() {
            return this.$store.getters['projects/currentProjectId']
        },

        currentOrgCode() {
            return this.$store.getters['organizations/current'].code
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

        selectedCategory: {
            type: Object,
            default: () => {},
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

            this.uploading = true
            const formData = new FormData()
            formData.append('file', this.file, this.file.name)
            formData.append('project_id', this.$store.getters['projects/currentProjectId'])

            const handleSuccess = ({ id, width, height }) => {
                const image = {
                    src: this.buildImageUrl(id),
                    width: width,
                    height: height,
                }

                this.$emit('onConfirm', image)
                this.closeModal()
            }

            const handleError = () => {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('resource.invalid-image'),
                    type: 'error',
                })
            }

            if (this.isOrganization) {
                postOrganizationImage({
                    orgCode: this.currentOrgCode,
                    body: formData,
                })
                    .then((image) => {
                        handleSuccess(image)
                        this.$emit('image', image)
                    })
                    .catch(() => handleError())
            }

            if (this.isFaqImage) {
                postFaqImage({
                    orgCode: this.currentOrgCode,
                    body: formData,
                })
                    .then((image) => {
                        handleSuccess(image)
                        this.$emit('image', image)
                    })
                    .catch(() => handleError())
            }

            if (this.isTemplateImage) {
                postTemplateImage({ id: this.selectedCategory.id, body: formData })
                    .then((image) => handleSuccess(image))
                    .catch(() => handleError())
            }

            if (this.isBlogEntryImage) {
                postBlogEntryImage({
                    project_id: this.currentProjectId,
                    body: formData,
                })
                    .then((image) => {
                        handleSuccess(image)
                        this.$emit('image', image)
                    })
                    .catch(() => handleError())
            } else if (this.isCommentImage) {
                postCommentImage(this.currentProjectId, formData)
                    .then((image) => handleSuccess(image))
                    .catch(() => handleError())
            } else if (this.isProjectView) {
                postProjectImage({
                    project_id: this.$store.state.projects.project.id,
                    body: formData,
                })
                    .then((image) => handleSuccess(image))
                    .catch(() => handleError())
            }

            this.uploading = false
        },
        buildImageUrl(image_id) {
            if (this.isFaqImage) {
                return `/v1/organization/${this.currentOrgCode}/faq-image/${image_id}/`
            } else if (this.isOrganization) {
                return `/v1/organization/${this.currentOrgCode}/image/${image_id}/`
            } else if (this.isTemplateImage) {
                return `/v1/category/${this.selectedCategory.id}/template-image/${image_id}/`
            } else if (this.isBlogEntryImage) {
                return `/v1/project/${this.currentProjectId}/blog-entry-image/${image_id}/`
            } else if (this.isCommentImage) {
                return `/v1/project/${this.currentProjectId}/comment-image/${image_id}/`
            } else {
                // isProjectView
                return `/v1/project/${this.currentProjectId}/image/${image_id}/`
            }
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

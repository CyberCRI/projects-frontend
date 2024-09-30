<template>
    <div class="project-form">
        <BaseDrawer
            :confirm-action-disabled="v$.$invalid || hasFileError"
            :has-footer="resourceTypeSelected || !isAddMode"
            :confirm-action-name="$t('common.save')"
            :is-opened="isOpened"
            :title="$filters.capitalize(label)"
            class="resource-modal small"
            @close="close()"
            @confirm="addEditResource"
            :asyncing="isSaving"
        >
            <div v-if="isAddMode && selectedType === null" class="select-resource">
                <LpiButton
                    :label="$filters.capitalize($t('resource.add-link'))"
                    btn-icon="LinkRotated"
                    @click="selectType('link')"
                    data-test="add-link"
                    class="button-select"
                    >Link
                </LpiButton>
                <LpiButton
                    :label="$filters.capitalize($t('resource.add-file'))"
                    btn-icon="File"
                    @click="selectType('file')"
                    data-test="add-file"
                    class="button-select"
                    >File
                </LpiButton>
            </div>

            <!-- ADD / EDIT LINK / FILE -->
            <div v-if="isLink || isFile">
                <template v-if="isFile && isAddMode">
                    <ImageInput
                        id="add-file-input"
                        :label="$filters.capitalize($t('file.upload') + ' *')"
                        class="text-input"
                        @upload-image="uploadImage"
                    />
                    <p v-if="hasFileError" class="error error-file">
                        {{ $t('common.file-required') }}
                    </p>
                </template>

                <template v-if="isLink">
                    <TextInput
                        v-model="link"
                        :label="$filters.capitalize($t('resource.link-address') + ' *')"
                        class="text-input"
                        data-test="input-link-adress"
                        placeholder="https://..."
                        @blur="v$.link.$touch"
                    />
                    <FieldErrors :errors="v$.link.$errors" />
                </template>

                <TextInput
                    v-model="title"
                    :label="$filters.capitalize($t('common.title') + ' *')"
                    :placeholder="$filters.capitalize($t('common.title'))"
                    class="text-input"
                    data-test="input-link-title"
                    @focus="checkFile"
                    @blur="v$.title.$touch"
                />
                <FieldErrors :errors="v$.title.$errors" />

                <TextInput
                    v-model="description"
                    :label="$filters.capitalize($t('form.description') + ' *')"
                    :placeholder="$filters.capitalize($t('form.description'))"
                    class="text-input"
                    data-test="input-link-description"
                    @focus="checkFile"
                    @blur="v$.description.$touch"
                />
                <FieldErrors :errors="v$.description.$errors" />
            </div>
        </BaseDrawer>
    </div>
</template>

<script>
import utils from '@/functs/functions.ts'

import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required, url } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import analytics from '@/analytics'
import { postAttachmentFiles, patchAttachmentFile } from '@/api/attachment-files.service'
import { postAttachmentLinks, patchAttachmentLink } from '@/api/attachment-links.service'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectsStore from '@/stores/useProjects.ts'
export default {
    name: 'ResourceDrawer',

    emits: ['close', 'reload-link-resources', 'reload-file-resources'],

    components: { LpiButton, ImageInput, BaseDrawer, TextInput, FieldErrors },
    setup() {
        const toaster = useToasterStore()
        const projectsStore = useProjectsStore()
        return {
            toaster,
            projectsStore,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        isAddMode: {
            type: Boolean,
            default: true,
        },

        selectedItem: {
            type: Object,
            default: null,
        },

        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            v$: useVuelidate(),
            selectedType: null,
            file: null,
            link: null,
            description: null,
            title: null,
            isSaving: false,
            hasFileError: false,
            resourceTypeSelected: false,
        }
    },

    validations() {
        const rules =
            this.selectedType === 'link' ||
            (this.selectedItem && this.selectedItem.attachment_type === 'link')
                ? {
                      required: helpers.withMessage(
                          this.$t('form.resources.link.required'),
                          required
                      ),
                      url: helpers.withMessage(this.$t('form.resources.link.format'), url),
                  }
                : {}

        return {
            title: {
                required: helpers.withMessage(this.$t('form.resources.title'), required),
            },
            description: {
                required: helpers.withMessage(this.$t('form.resources.description'), required),
            },
            link: rules,
        }
    },

    computed: {
        isLink() {
            return this.isAddMode
                ? this.selectedType === 'link' // if link is a video it become "video" after saving
                : ['link', 'video'].includes(this.selectedItem.attachment_type)
        },

        isFile() {
            return this.isAddMode
                ? this.selectedType === 'file'
                : this.selectedItem.attachment_type === 'file'
        },

        label() {
            if (this.selectedType === null && this.isAddMode) return this.$t('resource.add')
            if (this.isAddMode) {
                return this.isFile ? this.$t('resource.add-file') : this.$t('resource.add-link')
            } else {
                return this.isFile ? this.$t('resource.edit-file') : this.$t('resource.edit-link')
            }
        },

        projectSlug() {
            return this.projectsStore.currentProjectSlug
        },

        projectId() {
            return this.project?.id
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                this.hasFileError = false
                if (this.selectedItem) {
                    this.link = this.selectedItem.site_url
                    this.description = this.selectedItem.description
                    this.title = this.selectedItem.title
                } else {
                    this.selectedType = null
                    this.file = null
                    this.link = null
                    this.description = null
                    this.title = null
                }
            },
            immediate: true,
        },
    },

    methods: {
        selectType(type) {
            this.selectedType = type
            this.resourceTypeSelected = true
        },
        checkFile() {
            if (this.isFile && this.isAddMode) {
                this.hasFileError = !this.file
            }
        },
        linkExists() {
            return (
                this.projectsStore.project.links.filter(
                    (link) => utils.removePrefix(link.site_url) === utils.removePrefix(this.link)
                ).length > 0
            )
        },

        async addEditResource() {
            const isValid = await this.v$.$validate()
            if (isValid) this.isAddMode ? this.addResource() : this.editResource()
        },

        addResource() {
            this.isLink ? this.addLink() : this.addFile()
        },

        editResource() {
            this.isLink ? this.editLink() : this.editFile()
        },

        async addLink() {
            if (!this.linkExists()) {
                this.isSaving = true
                const body = {
                    project_id: this.projectId,
                    attachment_type: 'link',
                    description: this.description,
                    site_url: this.link,
                    title: this.title,
                }

                try {
                    const result = await postAttachmentLinks(body)

                    analytics.attachmentLink.addAttachment({
                        project: {
                            id: this.projectId,
                        },
                        attachment: result,
                    })

                    this.$emit('reload-link-resources')

                    this.toaster.pushSuccess(this.$t('toasts.link-create.success'))

                    if (this.$route && this.$route.name !== 'projectResources') {
                        this.$router.push({
                            name: 'projectResources',
                            params: { slugOrId: this.projectSlug },
                        })
                    }
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.link-create.error')} (${error})`)
                    console.error(error)
                } finally {
                    this.isSaving = false
                    this.close()
                }
            } else {
                this.toaster.pushError(this.$t('toasts.link-already-exists'))
            }
        },

        async addFile() {
            this.isSaving = true
            try {
                const body = {
                    file: this.file,
                    title: this.title,
                    description: this.description,
                    project_id: this.projectId,
                }

                const result = await postAttachmentFiles(body)

                analytics.attachmentFile.addAttachment({
                    project: {
                        id: this.projectId,
                    },
                    attachment: result,
                })

                this.$emit('reload-file-resources')

                this.toaster.pushSuccess(this.$t('toasts.file-create.success'))

                if (this.$route.name !== 'projectResources') {
                    this.$router.push({
                        name: 'projectResources',
                        params: { slugOrId: this.projectSlug },
                    })
                }
            } catch (error) {
                this.toaster.pushError(`${this.$t('toasts.file-create.error')} (${error})`)
                console.error(error)
            } finally {
                this.isSaving = false
                this.close()
            }
        },

        async editLink() {
            this.isSaving = true
            const body = {
                ...this.selectedItem,
                project_id: this.projectId,
                description: this.description,
                title: this.title,
                site_url: this.link,
            }

            try {
                const result = await patchAttachmentLink(body)

                analytics.attachmentLink.updateAttachment({
                    project: {
                        id: this.projectId,
                    },
                    attachment: result,
                })

                this.$emit('reload-link-resources')

                this.toaster.pushSuccess(this.$t('toasts.link-update.success'))
            } catch (error) {
                this.toaster.pushError(`${this.$t('toasts.link-update.error')} (${error})`)
                console.error(error)
            } finally {
                this.isSaving = false
                this.close()
            }
        },

        async editFile() {
            this.isSaving = true
            const body = {
                ...this.selectedItem,
                title: this.title,
                description: this.description,
                project_id: this.projectId,
                id: this.selectedItem.id,
            }

            try {
                const result = await patchAttachmentFile(body)

                analytics.attachmentFile.updateAttachment({
                    project: {
                        id: this.projectId,
                    },
                    attachment: result,
                })

                this.$emit('reload-file-resources')
                this.toaster.pushSuccess(this.$t('toasts.file-update.success'))
            } catch (error) {
                this.toaster.pushError(`${this.$t('toasts.file-update.error')} (${error})`)
                console.error(error)
            } finally {
                this.isSaving = false
                this.close()
            }
        },

        uploadImage(file) {
            this.file = file
            this.title = file.name
            this.hasFileError = false
        },

        close() {
            this.v$.$reset()
            this.$emit('close')
        },
    },
}
</script>

<style lang="scss" scoped>
.resource-modal {
    padding: $space-l;

    .text-input {
        padding: 0;
        padding-bottom: $space-xs;
    }

    .select-resource {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: stretch;

        .button-select {
            margin: $space-l;
        }
    }
}

:deep(.input-ctn) {
    box-sizing: border-box;
}
</style>

<style lang="scss">
// To remove scroll bar on dialogue modal, not needed in this case.
.resource-modal .s-modal-content {
    overflow: hidden !important;
}
</style>

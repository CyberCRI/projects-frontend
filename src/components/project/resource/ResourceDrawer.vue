<template>
    <div class="project-form">
        <BaseDrawer
            :confirm-action-disabled="hasFileError"
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
                    />
                    <p v-for="error of v$.link.$errors" :key="error.$uid" class="error-description">
                        {{ error.$message }}
                    </p>
                </template>

                <TextInput
                    v-model="title"
                    :label="$filters.capitalize($t('common.title') + ' *')"
                    :placeholder="$filters.capitalize($t('common.title'))"
                    class="text-input"
                    data-test="input-link-title"
                    @focus="checkFile"
                />
                <p v-for="error of v$.title.$errors" :key="error.$uid" class="error-description">
                    {{ error.$message }}
                </p>

                <TextInput
                    v-model="description"
                    :label="$filters.capitalize($t('form.description') + ' *')"
                    :placeholder="$filters.capitalize($t('form.description'))"
                    class="text-input"
                    data-test="input-link-description"
                    @focus="checkFile"
                />
                <p
                    v-for="error of v$.description.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
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

export default {
    name: 'ResourceDrawer',

    emits: ['close'],

    components: { LpiButton, ImageInput, BaseDrawer, TextInput },

    props: {
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
            return this.$store.getters['projects/currentProjectSlug']
        },

        projectId() {
            return this.$store.getters['projects/currentProjectId']
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
                this.$store.getters['projects/project'].links.filter(
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
                    project_id: this.$store.getters['projects/project'].id,
                    attachment_type: 'link',
                    description: this.description,
                    site_url: this.link,
                    title: this.title,
                }

                try {
                    await this.$store.dispatch('attachmentLinks/postAttachmentLinks', body)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.link-create.success'),
                        type: 'success',
                    })

                    if (this.$route && this.$route.name !== 'projectResources') {
                        this.$router.push({
                            name: 'projectResources',
                            params: { slugOrId: this.projectSlug },
                        })
                    }
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.link-create.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.isSaving = false
                    this.close()
                }
            } else {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.link-already-exists'),
                    type: 'error',
                })
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
                await this.$store.dispatch('attachmentFiles/postAttachmentFiles', body)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.file-create.success'),
                    type: 'success',
                })

                if (this.$route.name !== 'projectResources') {
                    this.$router.push({
                        name: 'projectResources',
                        params: { slugOrId: this.projectSlug },
                    })
                }
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.file-create.error')} (${error})`,
                    type: 'error',
                })
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
                await this.$store.dispatch('attachmentLinks/patchAttachmentLink', body)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.link-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.link-update.error')} (${error})`,
                    type: 'error',
                })
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
                await this.$store.dispatch('attachmentFiles/patchAttachmentFile', body)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.file-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.file-update.error')} (${error})`,
                    type: 'error',
                })
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

.error-description {
    color: $red;
    font-size: $font-size-s;
    margin-left: $space-l;
}

.error {
    color: $red;
    margin-top: $space-s;
    font-size: $font-size-s;
}
</style>

<style lang="scss">
// To remove scroll bar on dialogue modal, not needed in this case.
.resource-modal .s-modal-content {
    overflow: hidden !important;
}
</style>

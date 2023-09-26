<template>
    <DialogModal class="resource-modal" @close="$emit('close')" @submit="addEditResource">
        <template #header>{{ $filters.capitalize(label) }}</template>
        <template #body>
            <div v-if="isAddMode && selectedType === null" class="select-resource">
                <LpiButton
                    :label="$filters.capitalize($t('resource.add-link'))"
                    left-icon="LinkRotated"
                    @click="selectedType = 'link'"
                    >Link
                </LpiButton>
                <LpiButton
                    :label="$filters.capitalize($t('resource.add-file'))"
                    left-icon="File"
                    @click="selectedType = 'file'"
                    >File
                </LpiButton>
            </div>

            <!-- ADD / EDIT LINK / FILE -->
            <div v-if="isLink || isFile">
                <ImageInput
                    v-if="isFile && isAddMode"
                    id="add-file-input"
                    class="text-input"
                    @upload-image="uploadImage"
                />
                <TextInput
                    v-if="isLink"
                    v-model="link"
                    :label="$filters.capitalize($t('resource.link-address'))"
                    class="text-input"
                    data-test="input-link"
                    placeholder="https://..."
                />

                <TextInput
                    v-model="title"
                    :label="$filters.capitalize($t('common.title'))"
                    :placeholder="$filters.capitalize($t('common.title'))"
                    class="text-input"
                    data-test="input-link"
                />

                <TextInput
                    v-model="description"
                    :label="$filters.capitalize($t('form.description'))"
                    :placeholder="$filters.capitalize($t('form.description'))"
                    class="text-input"
                    data-test="input-link"
                />

                <div v-if="isLink" class="text-input">
                    <LinkCat
                        v-for="(category, index) in linkCategories"
                        :key="index"
                        :label="category.label"
                        :selected="selectedCategory && selectedCategory.label === category.label"
                        class="big"
                        @click="selectCategory(category)"
                    />
                </div>
            </div>
        </template>

        <template #button-1
            ><span>{{ $t('common.cancel') }}</span></template
        >

        <template #button-2
            ><span>{{ $t('common.save') }}</span></template
        >
    </DialogModal>
</template>

<script>
import utils from '@/functs/functions.ts'
import { RESOURCE_CATEGORY } from '@/functs/constants.ts'

import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import LinkCat from '@/components/shrcomponents/LinkCat.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ResourceModal',

    emits: ['close'],

    components: { LpiButton, ImageInput, DialogModal, TextInput, LinkCat },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },

        selectedItem: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            selectedType: null,
            file: null,
            link: null,
            description: null,
            title: null,
            linkCategories: [],
            selectedCategory: {
                label: this.$t('resource-category.other'),
                key: 'other',
            },
        }
    },

    created() {
        this.linkCategories = RESOURCE_CATEGORY.map((category) => ({
            label: this.$t(`resource-category.${category}`),
            key: category.toLowerCase(),
        }))
    },

    mounted() {
        if (this.selectedItem) {
            this.link = this.selectedItem.site_url
            this.description = this.selectedItem.description
            this.title = this.selectedItem.title
            this.selectedCategory = {
                label: this.$t(`resource-category.${this.selectedItem.category}`),
                key: this.selectedItem.category,
            }
        }
    },

    computed: {
        isLink() {
            return this.isAddMode
                ? this.selectedType === 'link'
                : this.selectedItem.attachment_type === 'link'
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

    methods: {
        linkExists() {
            return (
                this.$store.getters['projects/project'].links.filter(
                    (link) => utils.removePrefix(link.site_url) === utils.removePrefix(this.link)
                ).length > 0
            )
        },

        addEditResource() {
            this.isAddMode ? this.addResource() : this.editResource()
        },

        addResource() {
            this.isLink ? this.addLink() : this.addFile()
        },

        editResource() {
            this.isLink ? this.editLink() : this.editFile()
        },

        async addLink() {
            if (!this.linkExists()) {
                const body = {
                    project_id: this.$store.getters['projects/project'].id,
                    attachment_type: 'link',
                    category: this.selectedCategory.key,
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
                        this.$router.push(`/projects/${this.projectSlug}/resources`)
                    }
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.link-create.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.$emit('close')
                }
            } else {
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.link-already-exists'),
                    type: 'error',
                })
            }
        },

        async addFile() {
            try {
                await this.$store.dispatch('attachmentFiles/postAttachmentFiles', this.file)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.file-create.success'),
                    type: 'success',
                })

                if (this.$route.name !== 'projectResources') {
                    this.$router.push(`/projects/${this.projectSlug}/resources`)
                }
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.file-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
            }
        },

        async editLink() {
            const body = {
                ...this.selectedItem,
                project_id: this.projectId,
                category: this.selectedCategory ? this.selectedCategory.key : null,
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
                this.$emit('close')
            }
        },

        async editFile() {
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
                this.$emit('close')
            }
        },

        selectCategory(category) {
            this.selectedCategory = category
        },

        uploadImage(file) {
            const formData = new FormData()

            formData.append('src', file, file.name)
            formData.append('project_id', this.$store.getters['projects/currentProjectId'])
            formData.append('title', file.name)
            formData.append('file', file)
            formData.append('mime', file.type || 'file')

            this.file = formData
            this.title = file.name
        },
    },
}
</script>

<style lang="scss" scoped>
.resource-modal {
    padding: $space-l;

    .text-input {
        padding: $space-l;
    }

    .select-resource {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: stretch;
    }
}
</style>

<style lang="scss">
// To remove scroll bar on dialogue modal, not needed in this case.
.resource-modal .s-modal-content {
    overflow: hidden !important;
}
</style>

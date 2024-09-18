<template>
    <div class="project-resources">
        <div v-if="canEditProject" class="add-resource">
            <LpiButton
                :label="$filters.capitalize($t('resource.add'))"
                class="add-blog-btn"
                @click="projectLayoutToggleAddModal('resource')"
            />
        </div>

        <SectionHeader
            v-if="fileResources.length"
            :has-button="false"
            :quantity="fileResources.length"
            :title="$filters.capitalize($t('project.files', fileResources.length))"
        />

        <div v-if="fileResources.length" class="resource-ctn">
            <ResourceCard
                v-for="file in fileResources"
                :key="file.id"
                :can-delete="canEditProject"
                :can-edit="canEditProject"
                :resource="file"
                :subtitle="file.description"
                :title="file.title"
                icon="File"
                @edit-clicked="projectLayoutToggleAddModal('resource', file)"
                @delete-clicked="openModal(file, 'file')"
            />
        </div>

        <SectionHeader
            v-if="linkResources.length"
            :has-button="false"
            :quantity="linkResources.length"
            :title="$filters.capitalize($t('resource.web', linkResources.length))"
            class="link-header"
        />

        <div v-if="linkResources.length" class="resource-ctn">
            <ResourceCard
                v-for="link in linkResources"
                :key="link.id"
                :can-delete="canEditProject"
                :can-edit="canEditProject"
                :resource="link"
                :subtitle="link.description"
                :title="link.title"
                icon="LinkRotated"
                @edit-clicked="projectLayoutToggleAddModal('resource', link)"
                @delete-clicked="openModal(link, 'link')"
            />
        </div>

        <ConfirmModal
            v-if="confirmModalVisible"
            :content="confirmModalContent"
            :title="$t('common.delete')"
            @cancel="confirmModalVisible = false"
            @confirm="deleteResource(currentResource, currentType)"
            :asyncing="asyncing"
        />
    </div>
</template>

<script>
import SectionHeader from '@/components/base/SectionHeader.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ResourceCard from '@/components/project/resource/ResourceCard.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import analytics from '@/analytics'
import { deleteAttachmentFile } from '@/api/attachment-files.service'
import { deleteAttachmentLink } from '@/api/attachment-links.service'
import useToasterStore from '@/stores/useToaster.ts'
export default {
    name: 'ProjectResourcesTab',

    mixins: [permissions, ProjectTab],

    emits: ['reload-file-resources', 'reload-link-resources'],

    inject: ['projectLayoutToggleAddModal'],
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        fileResources: {
            type: Array,
            default: () => [],
        },
        linkResources: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            confirmModalVisible: false,
            currentType: null,
            currentResource: null,
            confirmModalContent: null,
            asyncing: false,
        }
    },

    components: {
        SectionHeader,
        ResourceCard,
        ConfirmModal,
        LpiButton,
    },

    methods: {
        openModal(resource, type) {
            this.confirmModalVisible = true
            this.currentType = type
            this.currentResource = resource

            this.confirmModalContent =
                this.currentType === 'link'
                    ? this.$t('project.link-confirm-delete')
                    : this.$t('project.file-confirm-delete')
        },

        async deleteResource(resource, type) {
            this.asyncing = true
            if (type === 'link') {
                try {
                    await deleteAttachmentLink({
                        id: resource.id,
                        projectId: this.project.id,
                    })

                    analytics.attachmentLink.removeAttachment({
                        project: {
                            id: this.project.id,
                        },
                        attachment: resource,
                    })

                    this.$emit('reload-link-resources')

                    this.toaster.pushSuccess(this.$t('toasts.link-delete.success'))
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.link-delete.error')} (${error})`)
                    console.error(error)
                } finally {
                    this.asyncing = false
                    this.confirmModalVisible = false
                }
            } else if (type === 'file') {
                try {
                    await deleteAttachmentFile({ id: resource.id, projectId: this.project?.id })

                    analytics.attachmentFile.removeAttachment({
                        project: {
                            id: this.project.id,
                        },
                        attachment: resource,
                    })

                    this.$emit('reload-file-resources')

                    this.toaster.pushSuccess(this.$t('toasts.file-delete.success'))
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.file-delete.error')} (${error})`)
                    console.error(error)
                } finally {
                    this.asyncing = false
                    this.confirmModalVisible = false
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.actions-ctn {
    position: absolute;
    top: -20px;
    right: 15px;
    display: flex;

    button:last-of-type {
        margin-left: $space-s;
    }
}

.project-resources {
    padding: $space-xl 0;

    .resource-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-m;
        padding: $space-l 0;

        > div {
            width: calc(33% - $space-m);
        }
    }

    .link-header {
        margin-top: $space-l;
    }

    .category-title {
        color: $primary-dark;
        text-transform: uppercase;
        font-size: $font-size-xs;
        font-weight: 700;
    }
}

.add-resource {
    display: flex;
    justify-content: flex-end;
    padding: $space-l 0;
}

@media screen and (max-width: $max-tablet) {
    .project-resources .resource-ctn {
        > div {
            width: calc(50% - $space-m);
        }
    }
}

@media screen and (max-width: $min-tablet) {
    .project-resources .resource-ctn {
        > div {
            width: 100%;
        }
    }
}
</style>

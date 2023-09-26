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
            v-if="files.length"
            :has-button="false"
            :quantity="files.length"
            :title="$filters.capitalize($t('project.files', files.length))"
        />

        <div v-if="files.length" class="resource-ctn">
            <ResourceCard
                v-for="file in files"
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
            v-if="links.length"
            :has-button="false"
            :quantity="links.length"
            :title="$filters.capitalize($t('resource.web', links.length))"
            class="link-header"
        />

        <div v-if="links.length" class="resource-ctn">
            <ResourceCard
                v-for="link in links"
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
        />
    </div>
</template>

<script>
import SectionHeader from '@/components/lpikit/ProjectView/shared/SectionHeader.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import ResourceCard from '@/components/lpikit/ResourceCard/ResourceCard.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ProjectResources',

    mixins: [permissions, ProjectTab],

    inject: ['projectLayoutToggleAddModal'],

    data() {
        return {
            confirmModalVisible: false,
            currentType: null,
            currentResource: null,
            confirmModalContent: null,
        }
    },

    components: {
        SectionHeader,
        ResourceCard,
        ConfirmModal,
        LpiButton,
    },

    computed: {
        files() {
            return (
                (this.$store.getters['projects/project'] &&
                    this.$store.getters['projects/project'].files) ||
                []
            )
        },

        links() {
            return (
                (this.$store.getters['projects/project'] &&
                    this.$store.getters['projects/project'].links) ||
                []
            )
        },

        // todo: add back if needed, to remove if Ignacio is happy ...
        // linksByTags() {
        //     const results = []
        //     this.links.forEach((link) => {
        //         if (results.every((result) => result.category !== link.category))
        //             results.push({
        //                 category: link.category,
        //                 links: [link],
        //             })
        //         else results.find((result) => result.category === link.category).links.push(link)
        //     })
        //     return results
        // },
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
            if (type === 'link') {
                try {
                    await this.$store.dispatch('attachmentLinks/deleteAttachmentLink', resource.id)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.link-delete.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.link-delete.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.confirmModalVisible = false
                }
            } else if (type === 'file') {
                try {
                    await this.$store.dispatch('attachmentFiles/deleteAttachmentFile', resource.id)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.file-delete.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.file-delete.error')} (${error})`,
                        type: 'error',
                    })
                    console.error(error)
                } finally {
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
    padding: $space-xl $space-l;

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

<template>
    <div class="block-container">
        <h2 class="title">{{ $t('admin.classifications.title') }}</h2>
        <p class="notice">{{ $t('admin.classifications.subtitle') }}</p>

        <div v-if="isLoadingOrgClassifications" class="loader">
            <LoaderSimple />
        </div>

        <div v-else>
            <div>
                <LpiButton
                    :label="$t('common.add')"
                    btn-icon="Plus"
                    @click="createClassificationIsOpen = true"
                />
            </div>
            <p v-if="!orgClassifications.length">
                {{ $t('admin.classifications.no-custom') }}
            </p>
            <table v-else class="table">
                <thead>
                    <tr>
                        <th>{{ $t('admin.classifications.title-field') }}</th>
                        <th>{{ $t('admin.classifications.description-field') }}</th>
                        <th>{{ $t(`admin.classifications.enabled-for-${type}`) }}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="classification in orgClassifications" :key="classification.id">
                        <td>
                            <strong>{{ classification.title }}</strong>
                        </td>
                        <td class="classification-description">
                            <ClassificationDescription :classification="classification" />
                        </td>
                        <td>
                            <LpiCheckbox
                                v-if="type === 'skills'"
                                class="as-button min-width"
                                :model-value="classification.is_enabled_for_skills"
                                @update:model-value="set_enabled_for_skills(classification, $event)"
                                :label="
                                    classification.is_enabled_for_skills
                                        ? $t('common.activated')
                                        : $t('common.activate')
                                "
                            />

                            <LpiCheckbox
                                v-if="type === 'projects'"
                                class="as-button min-width"
                                :model-value="classification.is_enabled_for_projects"
                                @update:model-value="
                                    set_enabled_for_projects(classification, $event)
                                "
                                :label="
                                    classification.is_enabled_for_projects
                                        ? $t('common.activated')
                                        : $t('common.activate')
                                "
                            />
                        </td>
                        <td>
                            <div class="actions">
                                <ContextActionButton
                                    secondary
                                    no-border
                                    action-icon="Pen"
                                    @click="classificationToEdit = classification"
                                    :disabled="!isCustomClassification(classification)"
                                />
                                <ContextActionButton
                                    secondary
                                    no-border
                                    action-icon="TrashCanOutline"
                                    @click="classificationToDelete = classification"
                                    :disabled="!isCustomClassification(classification)"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ConfirmModal
            v-if="classificationToDelete"
            :asyncing="isDeletingClassification"
            @cancel="classificationToDelete = null"
            @confirm="deleteClassification"
            :title="$t('admin.classifications.delete-classification.title')"
            :content="
                $t('admin.classifications.delete-classification.content', {
                    title: classification?.title,
                })
            "
        />
    </div>
    <EditClassification
        :classification="classificationToEdit"
        :is-open="classificationToEdit || createClassificationIsOpen"
        @close="closeEditClassification"
        @classification-edited="onClassificationEdited"
        @classification-created="onClassificationCreated"
    />
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import EditClassification from '@/components/admin/EditClassification.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { deleteOrgClassification } from '@/api/tag-classification.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useToasterStore from '@/stores/useToaster.ts'
import ClassificationDescription from '@/components/admin/ClassificationDescription.vue'
import { isCustomClassification } from '@/functs/ClassificationUtils.ts'
export default {
    name: 'ClassificationAdmin',

    components: {
        LpiButton,
        EditClassification,
        LoaderSimple,
        LpiCheckbox,
        ContextActionButton,
        ConfirmModal,
        ClassificationDescription,
    },

    props: {
        type: {
            type: String, // "skills" or "projects"
            required: true,
        },
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        const toaster = useToasterStore()
        const {
            orgClassifications,
            orgClassificationOptions,
            allOrgClassifications,
            isLoadingOrgClassifications,
            fetchAllClassifications,
        } = useTagSearch({
            hideOrganizationTags: true,
        })
        return {
            organizationsStore,
            toaster,
            orgClassifications,
            orgClassificationOptions,
            allOrgClassifications,
            isLoadingOrgClassifications,
            fetchAllClassifications,
        }
    },

    data() {
        return {
            confirmModalVisible: false,
            createClassificationIsOpen: false,
            classificationToDelete: null,
            classificationToEdit: null,
            isDeletingClassification: false,
        }
    },

    methods: {
        isCustomClassification(classification) {
            return isCustomClassification(classification)
        },
        async set_enabled_for_projects(classification, value) {
            try {
                // set enabled for projects
                // we remove it anyway and (re-)add it if needed
                const org_enabled_for_projects =
                    this.organizationsStore.current.enabled_projects_tag_classifications
                        .map((c) => c.id)
                        .filter((id) => id != classification.id)
                if (value) org_enabled_for_projects.push(classification.id)
                await this.organizationsStore.updateCurrentOrganization({
                    enabled_projects_tag_classifications: org_enabled_for_projects,
                })
                await this.fetchAllClassifications(true)

                this.toaster.pushSuccess(
                    value
                        ? this.$t('admin.classifications.enabled-for-projects-success')
                        : this.$t('admin.classifications.disabled-for-projects-success')
                )
            } catch (err) {
                this.toaster.pushError(this.$t('admin.classifications.edit-classification.error'))
                console.log(err)
            }
        },

        async set_enabled_for_skills(classification, value) {
            try {
                // set enabled for skills
                // we remove it anyway and (re-)add it if needed
                const org_enabled_for_skills =
                    this.organizationsStore.current.enabled_skills_tag_classifications
                        .map((c) => c.id)
                        .filter((id) => id != classification.id)
                if (value) org_enabled_for_skills.push(classification.id)
                await this.organizationsStore.updateCurrentOrganization({
                    enabled_skills_tag_classifications: org_enabled_for_skills,
                })
                await this.fetchAllClassifications(true)
                this.toaster.pushSuccess(
                    value
                        ? this.$t('admin.classifications.enabled-for-skills-success')
                        : this.$t('admin.classifications.disabled-for-skills-success')
                )
            } catch (err) {
                this.toaster.pushError(this.$t('admin.classifications.edit-classification.error'))
                console.log(err)
            }
        },
        closeEditClassification() {
            this.classificationToEdit = null
            this.createClassificationIsOpen = false
        },
        async onClassificationEdited() {
            this.closeEditClassification()
            await this.fetchAllClassifications(true)
        },
        async onClassificationCreated() {
            this.closeEditClassification()
            await this.fetchAllClassifications(true)
        },
        async onClassificationDeleted() {
            await this.fetchAllClassifications()
            this.classificationToDelete = null
        },

        async deleteClassification() {
            if (!this.classificationToDelete) return
            this.isDeletingClassification = true
            try {
                await deleteOrgClassification(
                    this.organizationsStore.current.code,
                    this.classificationToDelete.id
                )
                this.toaster.pushSuccess(
                    this.$t('admin.classifications.delete-classification.success')
                )
                this.onClassificationDeleted()
            } catch (err) {
                this.toaster.pushError(this.$t('admin.classifications.delete-classification.error'))
                console.log(err)
            } finally {
                this.isDeletingClassification = false
                this.classificationToDelete = null
            }
        },
    },
}
</script>

<style lang="scss" scoped>
strong {
    font-weight: bold;
}

.select-and-create {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-block: $space-l;
}

.title {
    text-transform: uppercase;
    font-weight: bold;
    color: $primary-dark;
    margin-bottom: $space-xl;
    font-size: $font-size-l;
}

.notice {
    margin-bottom: $space-l;
    font-size: $font-size-s;
}

.table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    thead,
    tbody tr {
        border-bottom: $border-width-s solid $mid-gray;
    }

    th {
        font-weight: 700;
        text-align: left;
    }

    td,
    th {
        padding: $space-m;
    }

    td.loader-td {
        padding: 0;
    }

    .actions {
        display: flex;
        gap: $space-s;
    }
}
</style>

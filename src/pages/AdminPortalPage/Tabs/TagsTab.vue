<template>
    <div class="tags-tab">
        <div class="block-container">
            <label class="label">Suggested tags</label>
            <small class="hint"
                >Select tags that will be suggested by default when searching or creating project
                and profiles</small
            >

            <div class="tags-ctn">
                <FilterValue
                    v-for="tag in organizationTags"
                    :key="tag.id"
                    :label="tagLabel(tag)"
                    icon="Close"
                    @click="deleteOrganizationTag(tag)"
                />
            </div>

            <div class="rel-ctn">
                <div class="input-container">
                    <LpiButton
                        :label="$filters.capitalize($t('common.add'))"
                        @click="tagSearchIsOpened = true"
                    />
                </div>
            </div>
        </div>
        <div class="block-container">
            <label class="label">Classifications</label>
            <small class="hint">Manage your custom classifications</small>
            <LpiButton
                label="Create classification"
                btn-icon="Plus"
                @click="createClassificationIsOpen = true"
            />

            <p v-if="!orgClassifications.length">No custom classification yet</p>

            <LpiSelect
                v-else-if="orgClassifications.length > 1"
                v-model="selectedClassificationId"
                :options="orgClassificationOptions"
            />
            <TagClassificationAdmin
                v-if="selectedClassification"
                :classification="selectedClassification"
                @delete-classification="deleteClassification"
            />
        </div>
        <BaseDrawer
            :confirm-action-name="$t('common.confirm')"
            :is-opened="tagSearchIsOpened"
            :title="$t('tag.add-wiki')"
            class="small"
            @close="closeTagsSelector"
            @confirm="saveOrganizationTags"
        >
            <TagsFilterEditor v-model="newTags" hide-organization-tags />
        </BaseDrawer>
        <EditClassification
            :classification="null"
            :is-open="createClassificationIsOpen"
            @close="createClassificationIsOpen = false"
        />
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import TagClassificationAdmin from '@/components/admin/TagClassificationAdmin.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import EditClassification from '@/components/admin/EditClassification.vue'
export default {
    name: 'TagsTab',

    components: {
        FilterValue,
        LpiButton,
        BaseDrawer,
        TagsFilterEditor,
        LpiSelect,
        TagClassificationAdmin,
        EditClassification,
    },
    setup() {
        const toaster = useToasterStore()
        const languagesStore = useLanguagesStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            languagesStore,
            organizationsStore,
            ...useTagSearch({
                hideOrganizationTags: true,
                classificationType: 'custom',
            }),
        }
    },

    data() {
        return {
            newOrganizationTag: '',
            newTags: [],
            confirmModalVisible: false,
            tagSearchIsOpened: false,
            createClassificationIsOpen: false,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
        },

        organizationTags() {
            return this.organization.tags
        },
    },

    methods: {
        async deleteClassification(classification) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.toaster.pushSuccess(`Classification ${classification.title} deleted`)
        },

        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
        },
        async saveOrganizationTags() {
            const newTagsIds = this.newTags.map((tag) => tag.id)
            const oldTagsIds = this.organizationTags.map((tag) => tag.id)

            try {
                await this.organizationsStore.updateCurrentOrganization({
                    tags: [...oldTagsIds, ...newTagsIds],
                })
                this.toaster.pushSuccess(this.$t('toasts.organization-tag-create.success'))
                this.tagSearchIsOpened = false
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-tag-create.error')} (${error})`
                )
                console.error(error)
            }
        },

        closeTagsSelector() {
            this.tagSearchIsOpened = false
        },

        async deleteOrganizationTag(tag) {
            try {
                await this.organizationsStore.updateCurrentOrganization({
                    tags: this.organizationTags.filter((t) => t.id != tag.id).map((t) => t.id),
                })
                this.toaster.pushSuccess(this.$t('toasts.organization-tag-delete.success'))
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-tag-delete.error')} (${error})`
                )
                console.error(error)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.block-container {
    padding: $space-l 0;
    margin: $space-l 0;
    background: $white;
    border-radius: $border-radius-l;

    .tags-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-m;
        margin-bottom: $space-l;
        margin-top: $space-l;
    }

    .wiki-input {
        width: fit-content;
        margin: 0 auto;
    }

    .wiki-results-ctn {
        border: $border-width-m solid $primary-dark;
        box-shadow: 0 0 15px rgb(0 0 0 / 50%);
        border-radius: $border-radius-m;
        margin-top: $space-s;
        overflow: hidden;
    }
}

.label {
    text-transform: uppercase;
    font-weight: bold;
    color: $primary-dark;
    display: block;
    margin-bottom: $space-xl;
}

.hint {
    display: block;
    margin-bottom: $space-l;
}

.input-container {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.input-tag {
    margin-bottom: $space-m;
}

@media (min-width: $min-desktop) {
    .block-container {
        margin: $space-l 0;
    }

    .input-container {
        justify-content: center;
        flex-direction: row;
    }

    .input-tag {
        margin-bottom: unset;
        margin-right: $space-m;
    }
}
</style>

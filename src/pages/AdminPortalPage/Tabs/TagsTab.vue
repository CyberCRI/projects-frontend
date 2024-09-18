<template>
    <div class="tags-tab">
        <div class="block-container">
            <label class="label">{{ $t('tag.add-specific') }}</label>
            <small class="hint">{{ $t('tag.add-specific-info') }}</small>

            <div class="tags-ctn">
                <FilterValue
                    v-for="tag in organizationTags"
                    :key="tag.id"
                    :label="tag.name"
                    icon="Close"
                    @click="deleteOrganizationTag(tag)"
                />
            </div>

            <div class="input-container">
                <TextInput
                    v-model="newOrganizationTag"
                    class="input-tag"
                    @enter="addOrganizationTag"
                />
                <LpiButton
                    :label="$filters.capitalize($t('common.add'))"
                    @click="addOrganizationTag"
                />
            </div>
        </div>

        <div class="block-container">
            <label class="label">{{ $t('tag.add-wiki') }}</label>
            <small class="hint">{{ $t('tag.add-wiki-info') }}</small>
            <p>{{ $t('project.tag-warning') }}</p>

            <div class="tags-ctn">
                <div v-for="tag in wikipediaTags" :key="tag.id">
                    <FilterValue
                        v-if="tag[`name_${currentLang}`] || tag.name"
                        :label="tag[`name_${currentLang}`] || tag.name"
                        icon="Close"
                        @click="deleteWikipediaTag(tag)"
                    />
                </div>
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
        <BaseDrawer
            :confirm-action-name="$t('common.confirm')"
            :is-opened="tagSearchIsOpened"
            :title="$t('tag.add-wiki')"
            class="small"
            @close="closeWikipediaTags"
            @confirm="saveWikipediaTags"
        >
            <TagsFilterEditor
                v-model="newWikipediaTags"
                :ambiguous-tags-open="ambiguousTagsOpen"
                :hide-organization-tags="true"
                @ambiguous-menu="ambiguousTagsOpen = $event"
            />
        </BaseDrawer>
    </div>
</template>

<script>
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import { getAllWikiTags } from '@/api/wikipedia-tags.service'
import { createOrgTag, getAllOrgTags, deleteOrgTag } from '@/api/organization-tags.service'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import useToasterStore from '@/stores/useToaster.ts'

export default {
    name: 'TagsTab',

    components: {
        FilterValue,
        TextInput,
        LpiButton,
        BaseDrawer,
        TagsFilterEditor,
    },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    async created() {
        await this.loadOrgTags()
        await this.loadWikiTags()
    },

    data() {
        return {
            newOrganizationTag: '',
            newWikipediaTags: [],
            orgConfirmModalVisible: false,
            wikiConfirmModalVisible: false,
            tagSearchIsOpened: false,
            ambiguousTagsOpen: false,
            wikipediaTags: [],
            organizationTags: [],
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        currentLang() {
            return this.$store.getters['languages/current']
        },
    },

    methods: {
        async loadWikiTags() {
            this.wikipediaTags = (
                await getAllWikiTags({
                    organization: this.$store.state.organizations.current.code,
                })
            ).results
        },

        async loadOrgTags() {
            this.organizationTags = await (
                await getAllOrgTags({
                    organization: this.$store.state.organizations.current.code,
                })
            ).results
        },

        async addOrganizationTag() {
            if (this.newOrganizationTag.length) {
                try {
                    await createOrgTag({
                        name: this.newOrganizationTag,
                        organization: this.organization.code,
                    })
                    await this.loadOrgTags()

                    this.toaster.pushSuccess(this.$t('toasts.organization-tag-create.success'))

                    this.newOrganizationTag = ''
                } catch (error) {
                    this.toaster.pushError(
                        `${this.$t('toasts.organization-tag-create.error')} (${error})`
                    )
                } finally {
                    this.tagSearchIsOpened = false
                }
            }
        },

        async saveWikipediaTags() {
            const newWikiIds = this.newWikipediaTags.map((tag) => tag.wikipedia_qid)

            try {
                await this.$store.dispatch('organizations/updateCurrentOrganization', {
                    wikipedia_tags_ids: newWikiIds,
                })
                await this.loadWikiTags()

                this.toaster.pushSuccess(this.$t('toasts.organization-tag-create.success'))

                this.tagSearchIsOpened = false
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-tag-create.error')} (${error})`
                )
                console.error(error)
            }
        },

        closeWikipediaTags() {
            this.newWikipediaTags = [...this.wikipediaTags]
            this.tagSearchIsOpened = false
        },

        async deleteOrganizationTag(tag) {
            try {
                await deleteOrgTag(tag.id)
                await this.loadOrgTags()
                this.toaster.pushSuccess(this.$t('toasts.organization-tag-delete.success'))
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-tag-delete.error')} (${error})`
                )
                console.error(error)
            }
        },

        async deleteWikipediaTag(tagToDelete) {
            const updatedWikipediaTagsIds = this.organization.wikipedia_tags
                .filter((tag) => tag.wikipedia_qid !== tagToDelete.wikipedia_qid)
                .map((tag) => tag.wikipedia_qid)

            try {
                await this.$store.dispatch('organizations/updateCurrentOrganization', {
                    wikipedia_tags_ids: updatedWikipediaTagsIds,
                })
                await this.loadWikiTags()
                this.toaster.pushSuccess(this.$t('toasts.organization-tag-delete.success'))
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-tag-delete.error')} (${error})`
                )
                console.error(error)
            }
        },
    },

    watch: {
        wikipediaTags: {
            handler: function (neo) {
                this.newWikipediaTags = [...neo]
            },
            immediate: true,
            deep: true,
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

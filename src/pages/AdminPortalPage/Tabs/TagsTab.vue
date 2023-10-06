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
        <DrawerLayout
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
        </DrawerLayout>
    </div>
</template>

<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'

import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import TagsFilterEditor from '@/components/peopleKit/Filters/TagsFilterEditor.vue'

export default {
    name: 'TagsTab',

    components: {
        FilterValue,
        TextInput,
        LpiButton,
        DrawerLayout,
        TagsFilterEditor,
    },

    async created() {
        await this.$store.dispatch('organizationTags/getAllTags')
        await this.$store.dispatch('wikipediaTags/getAllTags')
    },

    data() {
        return {
            newOrganizationTag: '',
            newWikipediaTags: [],
            orgConfirmModalVisible: false,
            wikiConfirmModalVisible: false,
            tagSearchIsOpened: false,
            ambiguousTagsOpen: false,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        organizationTags() {
            return this.$store.getters['organizationTags/all']
        },

        wikipediaTags() {
            return this.$store.getters['wikipediaTags/all']
        },

        currentLang() {
            return this.$store.getters['languages/current']
        },
    },

    methods: {
        async addOrganizationTag() {
            if (this.newOrganizationTag.length) {
                try {
                    await this.$store.dispatch('organizationTags/addTag', {
                        name: this.newOrganizationTag,
                        organization: this.organization.code,
                    })

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.organization-tag-create.success'),
                        type: 'success',
                    })

                    this.newOrganizationTag = ''
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.organization-tag-create.error')} (${error})`,
                        type: 'error',
                    })
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

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.organization-tag-create.success'),
                    type: 'success',
                })

                this.tagSearchIsOpened = false
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.organization-tag-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        closeWikipediaTags() {
            this.newWikipediaTags = [...this.wikipediaTags]
            this.tagSearchIsOpened = false
        },

        async deleteOrganizationTag(tag) {
            try {
                await this.$store.dispatch('organizationTags/deleteTag', tag.id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.organization-tag-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.organization-tag-delete.error')} (${error})`,
                    type: 'error',
                })
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
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.organization-tag-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.organization-tag-delete.error')} (${error})`,
                    type: 'error',
                })
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
.tags-tab {
    display: flex;
    flex-direction: column;
}

.block-container {
    padding: $space-l;
    margin: $space-l;
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
    line-height: 18px;
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
        margin: $space-l;
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
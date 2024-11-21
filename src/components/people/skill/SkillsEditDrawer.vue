<template>
    <BaseDrawer
        :confirm-action-disabled="asyncing || !addedTalent"
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpen"
        :title="$t(`profile.edit.skills.${type}.drawer.title`)"
        class="medium"
        @close="$emit('close')"
        @confirm="save"
    >
        <div class="add-skill-mode" v-if="!addedTalent">
            <div class="section" v-if="!searchAllMode">
                <p class="notice">{{ $t('search.pick-skill-classification') }}</p>

                <LpiSelect v-model="selectedClassificationId" :options="orgClassificationOptions" />
            </div>

            <div v-show="searchAllMode || showTagSearch" class="section">
                <p class="notice">{{ $t(`profile.edit.skills.${type}.drawer.notice`) }}</p>
                <div class="search-field no-shrink">
                    <SearchInput
                        v-model.trim="search"
                        @delete-query="onDeleteQuery"
                        @enter="doSearch"
                        :suggestions="suggestions"
                        @keyup="suggest"
                        :placeholder="$t(`profile.edit.skills.${type}.drawer.placeholder`)"
                    />
                    <LpiButton :label="$t(`profile.edit.skills.search`)" @click="doSearch" />
                </div>
            </div>

            <div v-if="!search.length && suggestedTags.length" class="section">
                <p class="notice">{{ $t('profile.edit.skills.suggested-skills') }}</p>
                <SuggestedTags
                    :current-tags="selectionAsTags"
                    :suggested-tags="suggestedTags"
                    @add-tag="selectTalent"
                    :loading="suggestedTagsisLoading"
                />
            </div>
            <div class="section" v-if="search.length">
                <p v-if="confirmedSearch && searchResultsCount" class="notice no-shrink">
                    {{ $t('search.choose-skill') }}
                </p>
                <TagResults
                    class="flexed-search-results-ctn custom-scrollbar"
                    v-if="confirmedSearch"
                    :classification-id="selectedClassificationId"
                    :existing-tags="selectionAsTags"
                    inline
                    :search="confirmedSearch"
                    @add-tag="selectTalent"
                    @results-count="searchResultsCount = $event"
                    :all-classifications="orgClassifications"
                    :search-all="searchAllMode"
                />
            </div>
        </div>
        <div class="edit-skill-mode" v-else>
            <p class="notice">
                {{ $t(`profile.edit.skills.${type}.drawer.notice-levels`) }}

                <SkillLevelTip>
                    <a href="#" class="help-link">
                        <IconImage name="HelpCircle" class="help-icon" />
                        {{ $t(`profile.edit.skills.${type}.drawer.help-levels`) }}
                    </a>
                </SkillLevelTip>
            </p>

            <div class="level-editor-list">
                <SkillEditor
                    :skill="addedTalent"
                    @set-level="setTalentLevel($event.skill, $event.level)"
                    @delete="addedTalent = null"
                />
            </div>
        </div>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import { toRaw } from 'vue'
import { postUserSkill } from '@/api/people.service.ts'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'
import SkillEditor from '@/components/people/skill/SkillEditor.vue'
export default {
    name: 'SkillsEditDrawer',

    emits: ['close', 'switch-mode', 'confirm', 'skills-updated'],

    inject: {
        reloadUser: {
            from: 'profileEditReloadUser',
            default: () => () => {},
        },
    },
    setup(props) {
        const toaster = useToasterStore()
        const languagesStore = useLanguagesStore()
        const {
            suggestedTagsisLoading,
            selectedClassificationId,
            selectedClassification,
            search,
            suggestions,
            suggestedTags,
            organizationsStore,
            orgClassifications,
            orgClassificationOptions,
            organizationTags,
            showTagSearch,
            suggest,
            loadSelectedClassificationTags,
            resetTagSearch,
            allOrgClassifications,
            isLoadingOrgClassifications,
            fetchAllClassifications,
        } = useTagSearch({ useSkills: true, searchAll: props.searchAllMode })
        return {
            toaster,
            languagesStore,
            suggestedTagsisLoading,
            selectedClassificationId,
            selectedClassification,
            search,
            suggestions,
            suggestedTags,
            organizationsStore,
            orgClassifications,
            orgClassificationOptions,
            organizationTags,
            showTagSearch,
            suggest,
            loadSelectedClassificationTags,
            resetTagSearch,
            allOrgClassifications,
            isLoadingOrgClassifications,
            fetchAllClassifications,
        }
    },

    components: {
        BaseDrawer,
        IconImage,
        SearchInput,
        TagResults,
        SkillLevelTip,
        LpiButton,
        LpiSelect,
        SuggestedTags,
        SkillEditor,
    },

    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String, // skills | hobbies
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
        searchAllMode: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            confirmedSearch: '',
            selection: [],
            asyncing: false,
            searchResultsCount: 0,
            addedTalent: null,
        }
    },
    computed: {
        selectionAsTags() {
            return this.selection.map((s) => s.tag)
        },
        allSkills() {
            return this.user.skills || []
        },
        skills() {
            return this.allSkills.filter((s) => s.type === 'skill')
        },
        hobbies() {
            return this.allSkills.filter((s) => s.type === 'hobby')
        },
    },
    watch: {
        isOpen(neo) {
            if (neo) {
                this.addedTalent = null
                this.search = ''
                this.confirmedSearch = ''
                this.selection = this.getSkillOfType(this.type)
                    ? this.getSkillOfType(this.type).map((item) => ({ ...toRaw(item) }))
                    : []

                this.resetTagSearch()
                this.$nextTick(this.focusInput)
            }
        },
    },
    methods: {
        getSkillOfType(type) {
            if (type == 'skills') return this.skills
            else return this.hobbies
        },
        focusInput() {
            const searchInput = this.$el.querySelector('.search-field input')
            this.$nextTick(() => {
                searchInput?.focus()
            })
        },

        doSearch() {
            this.suggestions = []
            this.confirmedSearch = this.search
        },

        onDeleteQuery() {
            this.search = ''
            this.confirmedSearch = ''
        },

        async save() {
            // save selection
            this.asyncing = true

            try {
                await postUserSkill(this.user.id, {
                    ...this.addedTalent,
                    tag: this.addedTalent.tag.id,
                })
                this.reloadUser()
                this.$emit('skills-updated')
                this.toaster.pushSuccess(this.$t('profile.edit.skills.save-success'))
            } catch (error) {
                if (error.response.status === 409) {
                    this.toaster.pushError(
                        `${this.$t(`profile.edit.skills.${this.type}.already-added`)}`
                    )
                } else {
                    this.toaster.pushError(
                        `${this.$t('profile.edit.skills.save-error')} (${error})`
                    )
                }
            } finally {
                this.asyncing = false
                this.$emit('close')
            }
        },
        selectTalent(tag) {
            const skill = {
                tag: tag,
                level: 1,
                level_to_reach: 1,
                type: this.type == 'hobbies' ? 'hobby' : 'skill',
                category: '', // TODO: check what this is
                user: this.user.id,
            }
            this.addedTalent = skill
        },
        setTalentLevel(talent, level) {
            talent.level = level
        },
    },
}
</script>
<style lang="scss" scoped>
.no-shrink {
    flex-shrink: 0;
}

.add-skill-mode {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .notice {
        font-size: $font-size-m;
        margin-bottom: $space-s;
    }

    .selected-list {
        margin-top: $space-m;
        display: flex;
        flex-flow: row wrap;
        gap: $space-m;
    }

    .search-field {
        margin-top: $space-m;
        display: flex;
        justify-content: stretch;
        align-items: center;
        gap: 1rem;

        .search-input-ctn {
            flex-grow: 1;

            :deep(.search-input) {
                width: 100%;
            }
        }
    }

    .flexed-search-results {
        overflow: auto;
    }

    .search-results {
        margin-top: $space-42;
        display: flex;
        flex-flow: row wrap;
        gap: $space-s;
        background-color: $primary-lighter;
        border-radius: $space-s;
        padding: $space-s;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $space-xl;
    }
}

.edit-skill-mode {
    .notice {
        margin-top: $space-m;
    }

    .help-link {
        color: $primary-dark;
        text-decoration: underline;
        font-weight: 700;
    }

    .help-icon {
        width: $font-size-l;
        height: $font-size-l;
        fill: $primary-dark;
        display: inline-block;
        vertical-align: middle;
    }
}

.section + .section {
    margin-top: $space-l;
}

.level-editor-list {
    margin-top: $space-xl;
}
</style>

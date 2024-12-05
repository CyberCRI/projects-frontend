<template>
    <div class="skills-filter-editor">
        <div class="section">
            <CurrentTags
                :current-tags="skills"
                class="current-skills"
                @remove-tag="removeSkill"
                show-separator
            />
        </div>

        <div class="section" v-if="!allSearchMode">
            <p class="notice">{{ $t('search.pick-skill-classification') }}</p>

            <LpiSelect
                data-test="classification-picker"
                v-model="selectedClassificationId"
                :options="orgClassificationOptions"
            />
        </div>

        <div v-show="allSearchMode || showTagSearch" class="section">
            <p class="notice">{{ $t('search.current-skill-description') }}</p>

            <FilterSearchInput
                ref="search-input-component"
                v-model.trim="search"
                :placeholder="$t('search.search-skill')"
                class="search-input-ctn"
            />

            <TagResults
                v-if="search || showPreSearchList"
                :classification-id="selectedClassificationId"
                :existing-tags="alreadySelectedSkills"
                :search="search"
                @add-tag="onAddSkill"
                :search-all="allSearchMode"
                :show-pre-search-list="showPreSearchList"
                type="skills"
            />

            <template v-else-if="suggestedTags.length">
                <p class="notice notice-suggested">{{ $t('search.pick-skill-preset') }}</p>

                <SuggestedTags
                    :current-tags="alreadySelectedSkills"
                    :suggested-tags="suggestedTags"
                    @add-tag="onAddSkill"
                    :loading="suggestedTagsAreLoading"
                />
            </template>
        </div>
    </div>
</template>

<script>
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'

export default {
    name: 'SkillsFilterEditor',

    emits: ['update:modelValue'],

    components: {
        FilterSearchInput,
        CurrentTags,
        SuggestedTags,
        TagResults,
        LpiSelect,
    },

    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        blockedSkills: {
            // unselctable skills (already selected ones)
            type: Array,
            default: () => [],
        },

        hideOrganizationTags: {
            // dont show org suggested skills
            type: Boolean,
            default: false,
        },
        allSearchMode: {
            // search all org classification
            // or a picked one
            type: Boolean,
            default: true,
        },
    },

    setup(props) {
        const {
            suggestedTagsAreLoading,
            selectedClassificationId,
            selectedClassification,
            search,
            suggestedTags,
            orgClassifications,
            orgClassificationOptions,
            showTagSearch,
            resetTagSearch,
        } = useTagSearch({
            useSkills: true,
            hideOrganizationTags: props.hideOrganizationTags,
        })
        return {
            suggestedTagsAreLoading,
            selectedClassificationId,
            selectedClassification,
            search,
            suggestedTags,
            orgClassifications,
            orgClassificationOptions,
            showTagSearch,
            resetTagSearch,
        }
    },
    data() {
        return {
            skills: [],
        }
    },

    computed: {
        alreadySelectedSkills() {
            return [...this.skills.map((s) => s.id), ...this.blockedSkills.map((s) => s.id)]
        },
        showPreSearchList() {
            return !this.allSearchMode && this.selectedClassification && !this.search
        },
    },

    mounted() {
        this.focusInput()
        // this.resetTagSearch()
    },

    methods: {
        addSkill(skill) {
            this.skills.push(skill)
            this.$emit('update:modelValue', this.skills)
        },

        focusInput() {
            const searchInput = this.$el.querySelector('.search-field input')
            this.$nextTick(() => {
                searchInput?.focus()
            })
        },

        onAddSkill(result) {
            this.addSkill(result)
            this.search = ''
            this.confirmedSearch = ''
            this.focusInput()
        },

        removeSkill(skill) {
            const skillIndex = this.skills.findIndex(
                (element) => element.id === skill.id && element.name === skill.name
            )
            this.skills.splice(skillIndex, 1)
            this.$emit('update:modelValue', this.skills)
        },
    },

    watch: {
        queryString(val) {
            if (val.length >= 3) {
                this.focusInput()
            }
        },

        modelValue: {
            handler: function (neo) {
                this.skills = [...neo]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.section {
    margin-bottom: $space-m;
}

.notice {
    font-size: $font-size-s;
    margin-bottom: $space-s;
}

.notice-suggested {
    margin-top: $space-m;
}

.current-skill {
    margin-top: pxToRem(16px);
}

.search-input-ctn {
    margin-bottom: $space-l;
    margin-top: $space-l;
}

.input-ctn {
    width: 100%;

    label {
        align-self: flex-start;
    }

    input {
        width: 100%;
    }
}

.lpi-select {
    width: 100%;
}
</style>

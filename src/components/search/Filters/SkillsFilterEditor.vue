<template>
    <div :class="{ inline }" class="skills-filter-editor">
        <div class="section">
            <CurrentTags :current-tags="skills" class="current-skills" @remove-tag="removeSkill" />
        </div>

        <div class="section">
            <p class="notice">{{ $t('search.pick-skill-classification') }}</p>

            <LpiSelect v-model="selectedClassificationId" :options="orgClassificationOptions" />
        </div>

        <div v-if="suggestedTags.length" class="section">
            <SuggestedTags
                :current-tags="skills"
                :suggested-tags="suggestedTags"
                @add-tag="onAddSkill"
                :loading="suggestedTagsisLoading"
            />
        </div>

        <div v-show="showTagSearch" class="section">
            <p class="notice">{{ $t('search.current-skill-description') }}</p>

            <FilterSearchInput
                ref="search-input-component"
                v-model.trim="search"
                :placeholder="$t('search.search-skill')"
                class="search-input-ctn"
            />

            <TagResults
                v-if="search"
                :classification-id="selectedClassificationId"
                :existing-tags="skills"
                :inline="inline"
                :search="search"
                @add-tag="onAddSkill"
                @go-back="goBackToAddMode"
            />
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

        triggerUpdate: {
            type: Boolean,
            default: false,
        },

        hideOrganizationTags: {
            type: Boolean,
            default: false,
        },

        inline: {
            type: Boolean,
            default: false,
        },
    },

    setup(props) {
        return {
            ...useTagSearch({ useSkills: true, hideOrganizationTags: props.hideOrganizationTags }),
        }
    },
    data() {
        return {
            skills: [],
        }
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

        goBackToAddMode() {
            this.search = ''
            this.confirmedSearch = ''
            this.focusInput()
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

        triggerUpdate: function () {
            this.$emit('update:modelValue', this.skills)
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

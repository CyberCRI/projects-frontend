<template>
    <div :class="{ inline }">
        <CurrentTags :current-tags="skills" class="current-skills" @remove-tag="removeSkill" />

        <div class="section">
            <p class="notice">{{ $t('search.current-classification-description') }}</p>

            <LpiSelect v-model="selectedClassificatonId" :options="orgClassificationOptions" />
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

            <div class="search-field">
                <SearchInput
                    v-model="search"
                    @delete-query="onDeleteQuery"
                    @enter="doSearch"
                    :placeholder="$t('search.search-skill')"
                    :suggestions="suggestions"
                    @keyup="suggest"
                />
                <LpiButton :label="$t(`profile.edit.skills.search`)" @click="doSearch" />
            </div>
            <p v-if="confirmedSearch" class="skill-description">
                {{ $t('search.choose-skill') }}
            </p>
            <TagResults
                v-if="confirmedSearch"
                :existing-tags="skills"
                :inline="inline"
                :search="confirmedSearch"
                @add-tag="onAddSkill"
                @go-back="goBackToAddMode"
            />
        </div>
    </div>
</template>

<script>
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'
import TagResults from '@/components/search/FilterTags/TagResults.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import useTagSearch from '@/composables/useTagSearch.js'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'

export default {
    name: 'SkillsFilterEditor',

    emits: ['update:modelValue'],

    components: {
        CurrentTags,
        TagResults,
        LpiButton,
        SearchInput,
        LpiSelect,
        SuggestedTags,
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

        inline: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        return {
            ...useTagSearch(),
        }
    },
    data() {
        return {
            skills: [],
        }
    },

    mounted() {
        this.focusInput()
    },

    methods: {
        doSearch() {
            this.suggestions = []
            this.confirmedSearch = this.search
        },

        onDeleteQuery() {
            this.confirmedSearch = ''
            this.search = ''
        },

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
.skill-description {
    font-size: $font-size-s;
    margin-top: $space-l;
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
</style>

<template>
    <div :class="{ inline }">
        <CurrentTags :current-tags="skills" class="current-skills" @remove-tag="removeSkill" />

        <p v-if="isAddMode" class="skill-description">
            {{ $t('search.current-skill-description') }}
        </p>

        <div class="search-field">
            <SearchInput
                v-model="queryString"
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
        <WikipediaResults
            v-if="confirmedSearch"
            :ambiguous-results-visible="ambiguousTagsOpen"
            :existing-tags="skills"
            :inline="inline"
            :query-string="confirmedSearch"
            @add-tag="onAddSkill"
            @go-back="goBackToAddMode"
            @ambiguous-menu="setAmbiguousMenuValue"
        />
    </div>
</template>

<script>
import CurrentTags from '@/components/lpikit/FilterTags/CurrentTags.vue'
import WikipediaResults from '@/components/lpikit/FilterTags/WikipediaResults.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import debounce from 'lodash.debounce'
import { wikiAutocomplete } from '@/api/wikipedia-tags.service'

export default {
    name: 'SkillsFilterEditor',

    emits: ['update:modelValue', 'ambiguous-menu'],

    components: {
        CurrentTags,
        WikipediaResults,
        LpiButton,
        SearchInput,
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

        ambiguousTagsOpen: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            isAddMode: true,
            queryString: '',
            confirmedSearch: '',
            skills: [],
            suggestions: [],
        }
    },

    mounted() {
        this.focusInput()
    },

    methods: {
        suggest: debounce(async function (evt) {
            if (evt.key === 'Enter') return // dont show suggestion when triggering search
            this.suggestions = []
            try {
                this.suggestions = await wikiAutocomplete(this.queryString)
            } catch (e) {
                console.error(e)
            }
        }, 100),

        doSearch() {
            this.suggestions = []
            this.confirmedSearch = this.queryString
        },

        onDeleteQuery() {
            this.confirmedSearch = ''
            this.queryString = ''
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
            this.isAddMode = true
            this.queryString = ''
            this.confirmedSearch = ''
            this.focusInput()
        },

        onAddSkill(result) {
            this.addSkill(result)
            this.isAddMode = true
            this.queryString = ''
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

        setAmbiguousMenuValue(value) {
            this.$emit('ambiguous-menu', value)
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
    line-height: 16px;
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

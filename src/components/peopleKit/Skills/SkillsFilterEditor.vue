<template>
    <div :class="{ inline }">
        <CurrentTags :current-tags="skills" class="current-skills" @remove-tag="removeSkill" />

        <p v-if="isAddMode" class="skill-description">
            {{ $t('search.current-skill-description') }}
        </p>

        <FilterSearchInput
            v-show="!ambiguousTagsOpen"
            ref="search-input-component"
            v-model="queryString"
            :placeholder="$t('search.search-skill')"
            class="search-input-ctn"
        />

        <WikipediaResults
            v-if="queryString"
            :ambiguous-results-visible="ambiguousTagsOpen"
            :existing-tags="skills"
            :inline="inline"
            :query-string="queryString"
            @add-tag="onAddSkill"
            @go-back="goBackToAddMode"
            @ambiguous-menu="setAmbiguousMenuValue"
        />
    </div>
</template>

<script>
import FilterSearchInput from '@/components/peopleKit/Filters/FilterSearchInput.vue'
import CurrentTags from '@/components/lpikit/FilterTags/CurrentTags.vue'
import WikipediaResults from '@/components/lpikit/FilterTags/WikipediaResults.vue'

export default {
    name: 'SkillsFilterEditor',

    emits: ['update:modelValue', 'ambiguous-menu'],

    components: {
        FilterSearchInput,
        CurrentTags,
        WikipediaResults,
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
            skills: [],
        }
    },

    mounted() {
        this.focusInput()
    },

    methods: {
        addSkill(skill) {
            this.skills.push(skill)
            this.$emit('update:modelValue', this.skills)
        },

        focusInput() {
            const searchInput = this.$refs['search-input-component'].$refs['search-input']
            this.$nextTick(() => {
                searchInput.focus()
            })
        },

        goBackToAddMode() {
            this.isAddMode = true
            this.queryString = ''
            this.focusInput()
        },

        onAddSkill(result) {
            this.addSkill(result)
            this.isAddMode = true
            this.queryString = ''
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
</style>

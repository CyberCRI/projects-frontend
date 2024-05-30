<template>
    <div :class="{ inline }" class="tags-filter-editor">
        <CurrentTags :current-tags="tags" class="current-tags" @remove-tag="removeTag" />

        <p v-if="isAddMode" class="tag-description">{{ $t('search.current-tag-description') }}</p>

        <FilterSearchInput
            v-show="!ambiguousTagsOpen"
            ref="search-input-component"
            v-model.trim="queryString"
            :placeholder="$t('search.search-tag')"
            class="search-input-ctn"
        />

        <SuggestedTags
            v-if="isAddMode && !hideOrganizationTags"
            :current-tags="tags"
            :suggested-tags="suggestedTags"
            @add-tag="addTag"
            :loading="suggestedTagsisLoading"
        />

        <WikipediaResults
            v-else-if="queryString"
            :ambiguous-results-visible="ambiguousTagsOpen"
            :existing-tags="tags"
            :inline="inline"
            :query-string="queryString"
            @add-tag="onAddTag"
            @go-back="goBackToAddMode"
            @ambiguous-menu="setAmbiguousMenuValue"
        />
    </div>
</template>

<script>
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'
import WikipediaResults from '@/components/search/FilterTags/WikipediaResults.vue'
import { getAllWikiTags } from '@/api/wikipedia-tags.service'
import { getAllOrgTags } from '@/api/organization-tags.service'
export default {
    name: 'TagsFilterEditor',

    emits: ['update:modelValue', 'ambiguous-menu', 'update-tags'],

    components: {
        FilterSearchInput,
        CurrentTags,
        SuggestedTags,
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

        hideOrganizationTags: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
        progressiveUpdate: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            suggestedTags: [],
            ambiguousResultsVisible: false,
            isAddMode: true,
            queryString: '',
            tags: [],
            wikipediaTags: [],
            organizationTags: [],
            suggestedTagsisLoading: true,
        }
    },

    async created() {
        await Promise.all([
            getAllOrgTags({
                organization: this.$store.state.organizations.current.code,
            }).then(({ results }) => {
                this.organizationTags = results
            }),
            getAllWikiTags({
                organization: this.$store.state.organizations.current.code,
            }).then(({ results }) => {
                this.wikipediaTags = results
            }),
        ])

        this.suggestedTags = [...this.organizationTags, ...this.wikipediaTags]
        this.suggestedTagsisLoading = false
    },

    mounted() {
        this.focusInput()
    },

    methods: {
        addTag(tag) {
            this.tags.push(tag)
            if (this.progressiveUpdate) {
                this.$emit('update:modelValue', this.tags)
            } else {
                this.$emit('update-tags', this.tags)
            }
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

        onAddTag(result) {
            this.addTag(result)
            this.isAddMode = true
            this.queryString = ''
            this.focusInput()
        },

        removeTag(tag) {
            const tagIndex = this.tags.findIndex(
                (element) => element.id === tag.id && element.name === tag.name
            )
            this.tags.splice(tagIndex, 1)
            if (this.progressiveUpdate) {
                this.$emit('update:modelValue', this.tags)
            } else {
                this.$emit('update-tags', this.tags)
            }
        },

        setAmbiguousMenuValue(value) {
            this.$emit('ambiguous-menu', value)
        },
    },

    watch: {
        queryString(val) {
            if (val.length >= 3) {
                this.isAddMode = false
                this.focusInput()
            }
        },

        triggerUpdate: function () {
            this.$emit('update:modelValue', this.tags)
        },

        modelValue: {
            handler: function (neo) {
                this.tags = [...neo]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.tag-description {
    font-size: $font-size-s;
    margin-top: $space-l;
}

.current-tags {
    margin-top: pxToRem(16px);
}

.tag-search-title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: 700;
    margin: pxToRem(46px) auto;
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

.add-modal .s-modal-wrapper .s-modal-content {
    max-height: 526px;
}

.search-modal .s-modal-wrapper .s-modal-content {
    max-height: 660px;
}

.tag-search-label {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 700;
    margin: 0 0 $space-s $space-l;
}
</style>

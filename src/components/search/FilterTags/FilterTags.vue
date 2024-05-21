<template>
    <div>
        <CurrentTags
            v-if="isAddMode"
            :current-tags="tags"
            @empty-current-tags="emptyCurrentTags"
            @remove-tag="removeTag"
        />

        <p v-if="isAddMode" class="tag-search-label">{{ $t('search.search-in') }}</p>

        <SearchInput
            ref="search-input-component"
            v-model="queryString"
            :full="true"
            :placeholder="$t('search.search')"
            class="search-input-ctn"
            @delete-query="goBackToAddMode"
        />

        <SuggestedTags
            v-if="isAddMode"
            :current-tags="tags"
            :suggested-tags="suggestedTags"
            @add-tag="addTag"
            :loading="suggestedTagsisLoading"
        />

        <WikipediaResults
            v-else
            :in-modal="inModal"
            :query-string="queryString"
            @add-tag="onAddTag"
            @go-back="goBackToAddMode"
        />
    </div>
</template>

<script>
import SearchInput from '@/components/base/form/SearchInput.vue'
import CurrentTags from './CurrentTags.vue'
import SuggestedTags from './SuggestedTags.vue'
import WikipediaResults from './WikipediaResults.vue'
import { getAllWikiTags } from '@/api/wikipedia-tags.service'
import { getAllOrgTags } from '@/api/organization-tags.service'
export default {
    name: 'FilterTags',

    emits: ['update-filters'],

    components: {
        SearchInput,
        CurrentTags,
        SuggestedTags,
        WikipediaResults,
    },

    props: {
        preselection: {
            type: Array,
            default: () => [],
        },

        triggerUpdate: {
            type: Boolean,
            required: true,
        },
        inModal: {
            type: Boolean,
            dafult: false,
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
        this.tags = [...this.preselection]
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

    computed: {
        // tagSearchTitle() {
        //     return this.isAddMode ? this.$t('search.add-a-tag') : this.$t('search.search-for-a-tag')
        // },
    },

    methods: {
        addTag(tag) {
            this.tags.push(tag)
        },

        emptyCurrentTags() {
            this.tags = []
        },

        focusInput() {
            const searchInput = this.$refs['search-input-component'].$refs['search-input']
            if (searchInput) {
                this.$nextTick(() => {
                    searchInput.focus()
                })
            }
        },

        goBackToAddMode() {
            this.isAddMode = true
            this.queryString = ''
            this.focusInput()
        },

        onAddTag(result) {
            this.tags.push(result)
            this.isAddMode = true
            this.queryString = ''
            this.focusInput()
        },

        removeTag(tag) {
            const tagIndex = this.tags.findIndex(
                (element) => element.id === tag.id && element.name === tag.name
            )
            this.tags.splice(tagIndex, 1)
        },
    },

    watch: {
        queryString(val) {
            if (val.length >= 3) {
                this.isAddMode = false
                this.focusInput()
            } else {
                this.isAddMode = true
            }
        },

        triggerUpdate: function () {
            this.$emit('update-filters', this.tags)
        },
    },
}
</script>

<style lang="scss" scoped>
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
</style>

<style lang="scss" scoped>
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
    margin: $space-l 0 0 $space-s;
}
</style>

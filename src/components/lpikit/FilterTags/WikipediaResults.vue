<template>
    <div v-if="isLoading" class="loader-ctn">
        <LoaderSimple />
    </div>

    <transition-group
        v-else
        :class="{ 'in-modal': inModal, inline }"
        :name="!ambiguousResultsVisible ? 'slideleft' : 'slideleftback'"
        class="search-mode-ctn"
        tag="div"
    >
        <SearchResults
            v-show="!ambiguousResultsVisible"
            key="search-results"
            :back-button="backButton"
            :in-modal="inModal"
            :tag-results="tagResults"
            @result-clicked="handleResultClicked"
            @go-back="$emit('go-back')"
            :inline="inline"
        />

        <AmbiguousResults
            v-show="ambiguousResultsVisible"
            key="ambiguous-results"
            :ambiguous-results="ambiguousResults"
            :ambiguous-term="ambiguousTerm"
            :in-modal="inModal"
            @go-back-to-results="$emit('ambiguous-menu', false)"
            @result-clicked="handleResultClicked"
            :inline="inline"
        />
    </transition-group>
</template>

<script>
import debounce from 'lodash.debounce'
import { getWikiTagDisambiguate } from '@/api/wikipedia-tags.service'

import SearchResults from './SearchResults.vue'
import AmbiguousResults from './AmbiguousResults.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import { searchWikiTags } from '@/api/wikipedia-tags.service'

/**
 * TODO: remove ambiguous tag handling logic, it is not needed anymore
 */

export default {
    name: 'WikipediaResults',

    emits: ['go-back', 'ambiguous-menu', 'add-tag'],

    components: {
        SearchResults,
        AmbiguousResults,
        LoaderSimple,
    },

    props: {
        existingTags: {
            type: Array,
            default: () => [],
            validator: function (value) {
                return value.reduce((acc, item) => acc && !!item.wikipedia_qid, true)
            },
        },

        ambiguousResultsVisible: {
            type: Boolean,
            default: true,
        },

        queryString: {
            type: String,
            default: '',
        },

        backButton: {
            type: Boolean,
            default: true,
        },
        inModal: {
            type: Boolean,
            dafult: false,
        },
        inline: {
            type: Boolean,
            deault: false,
        },
    },

    data() {
        return {
            ambiguousResults: [],
            ambiguousTerm: '',
            foundTags: [],
            isLoading: true,
            tagResults: [],
            results: [],
        }
    },

    mounted() {
        this.launchSearch(this.queryString)
    },

    methods: {
        filterTags() {
            if (this.existingTags.length) {
                const tagsQid = this.existingTags.map((tag) => tag.wikipedia_qid)
                let filteredResults = this.results.filter(
                    (tag) => !tagsQid.includes(tag.wikipedia_qid)
                )
                return filteredResults
            }
            return this.results
        },
        async handleResultClicked(result) {
            if (result.ambiguous) {
                this.ambiguousTerm = result.name
                const ambiguousResults = await getWikiTagDisambiguate(result.pageid)

                this.ambiguousResults = ambiguousResults
                    .filter((result) => !!result.pageprops)
                    .map((result) => {
                        return { ...result, wikipedia_qid: result.pageprops.wikibase_item }
                    })
                if (this.existingTags.length) {
                    const tagsQid = this.existingTags.map((tag) => tag.wikipedia_qid)
                    this.ambiguousResults = this.ambiguousResults.filter(
                        (tag) => !tagsQid.includes(tag.pageprops.wikibase_item)
                    )
                }

                this.$emit('ambiguous-menu', true)
            } else {
                this.$emit('add-tag', result)
                this.$emit('ambiguous-menu', false)
            }
        },

        launchSearch: debounce(async function () {
            this.isLoading = true
            try {
                const req = await searchWikiTags(this.queryString).catch(() => [])
                let rawResults = req.results

                // Put ambiguous tags first
                let orderedResults = [
                    ...rawResults.filter((tag) => tag.is_ambiguous),
                    ...rawResults.filter((tag) => !tag.is_ambiguous),
                ]

                // Format results
                this.results = orderedResults.map((result) => {
                    return {
                        name: result.name,
                        description: result.description || '',
                        ambiguous: !!result.is_ambiguous,
                        wikipedia_qid: result.wikipedia_qid,
                    }
                })

                // Filter existing tags
                this.tagResults = this.filterTags()
            } catch (e) {
                console.error(e)
            } finally {
                this.isLoading = false
            }
        }, 500),
    },

    watch: {
        queryString(neo) {
            if (neo.length >= 3) this.launchSearch()
        },

        ambiguousResultsVisible() {
            this.$emit('ambiguous-menu', this.ambiguousResultsVisible)
        },

        existingTags() {
            this.tagResults = this.filterTags()
        },
    },
}
</script>

<style lang="scss" scoped>
.search-mode-ctn {
    position: relative;
    width: 100%;

    > div {
        position: absolute;
        width: 100%;
    }

    &.inline > div {
        position: static;
        overflow: auto;
    }
}

.search-mode-ctn.in-modal {
    > div {
        position: static;
    }
}

.loader-ctn {
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

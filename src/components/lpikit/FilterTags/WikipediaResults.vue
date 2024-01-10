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
            // ambiguousResultsVisible: false,
            ambiguousTerm: '',
            foundTags: [],
            isLoading: true,
            tagResults: [],
        }
    },

    mounted() {
        this.launchSearch(this.queryString)
    },

    methods: {
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
            const results = await searchWikiTags(this.queryString).catch(() => [])

            // Filter existing tags
            let filteredResults = results
            if (this.existingTags.length) {
                const tagsQid = this.existingTags.map((tag) => tag.wikipedia_qid)
                filteredResults = results.filter(
                    (tag) => tag.pageprops && !tagsQid.includes(tag.pageprops.wikibase_item)
                )
            }

            // Put ambiguous tags first
            let orderedResults = [
                ...filteredResults.filter((tag) => tag.is_ambiguous),
                ...filteredResults.filter((tag) => !tag.is_ambiguous),
            ]

            // Format results
            this.tagResults = orderedResults.map((result) => {
                return {
                    name: result.title,
                    description: result.extract
                        ? result.extract
                        : result.terms && result.terms.description
                        ? result.terms.description[0]
                        : '',
                    ambiguous: !!result.is_ambiguous,
                    links: result.is_ambiguous ? result.links : null,
                    wikipedia_qid: result.pageprops.wikibase_item,
                    pageid: result.pageid,
                }
            })
            this.isLoading = false
        }, 500),
    },

    watch: {
        queryString(neo) {
            if (neo.length >= 3) this.launchSearch()
        },

        ambiguousResultsVisible() {
            this.$emit('ambiguous-menu', this.ambiguousResultsVisible)
        },
    },
}
</script>

<style lang="scss" scoped>
.search-mode-ctn {
    position: relative;
    height: 100%;
    width: 100%;

    > div {
        position: absolute;
        height: 100%;
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

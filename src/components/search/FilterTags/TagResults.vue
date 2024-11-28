<template>
    <div v-if="isLoading" class="loader-ctn">
        <LoaderSimple />
    </div>

    <transition-group
        v-else
        :class="{ 'in-modal': inModal, inline }"
        name="slideleft"
        class="search-mode-ctn"
        tag="div"
    >
        <SearchResults
            key="search-results"
            :back-button="backButton"
            :in-modal="inModal"
            :tag-results="tagResults"
            :existing-tags="existingTags"
            @result-clicked="handleResultClicked"
            @go-back="$emit('go-back')"
            :inline="inline"
        />
    </transition-group>
</template>

<script>
import debounce from 'lodash.debounce'

import { getOrgClassificationTags } from '@/api/tag-classification.service'

import SearchResults from './SearchResults.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'TagResults',

    emits: ['go-back', 'add-tag', 'results-count'],

    components: {
        SearchResults,
        LoaderSimple,
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
            organizationsStore,
        }
    },

    props: {
        search: {
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
        classificationId: {
            type: Number,
            default: null,
        },
        allClassifications: {
            type: Array,
            default: () => [],
        },
        searchAll: {
            type: Boolean,
            default: false,
        },
        existingTags: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            ambiguousResults: [],
            ambiguousTerm: '',
            foundTags: [],
            isLoading: true,
            tagResults: [],
        }
    },

    async mounted() {
        await this.launchSearch(this.search)
    },

    methods: {
        async handleResultClicked(result) {
            this.$emit('add-tag', result)
        },

        launchSearch: debounce(async function () {
            this.isLoading = true
            try {
                let req
                if (this.searchAll) {
                    req = await Promise.all(
                        this.allClassifications.map((c) =>
                            getOrgClassificationTags(this.organizationsStore.current.code, c.id, {
                                search: this.search,

                                language: this.languagesStore.current,
                            })
                        )
                    )
                        .then((classificationsResults) => {
                            console.log(classificationsResults)
                            const data = classificationsResults.map((r) => r.data)
                            const maxLength = Math.max(...data.map((d) => d.count))
                            const count = data.reduce((acc, d) => acc + d.count, 0)
                            const results = []
                            for (let i = 0; i < maxLength; i++) {
                                for (let j = 0; j < this.allClassifications.length; j++) {
                                    if (data[j]?.results[i])
                                        results.push({
                                            ...data[j]?.results[i],
                                            classificationName: this.allClassifications[j].title,
                                        })
                                }
                            }
                            return { count, results }
                        })
                        .catch((e) => {
                            console.log(e)
                            return {
                                count: 0,
                                results: [],
                            }
                        })
                } else {
                    req = await getOrgClassificationTags(
                        this.organizationsStore.current.code,
                        this.classificationId,
                        { search: this.search, language: this.languagesStore.current }
                    )
                        .then((r) => r.data)
                        .catch(() => ({
                            count: 0,
                            results: [],
                        }))
                }
                this.$emit('results-count', req.count)
                this.tagResults = req.results
            } catch (e) {
                console.error(e)
            } finally {
                this.isLoading = false
            }
        }, 500),
    },

    watch: {
        search(neo) {
            if (neo.length >= 3) this.launchSearch()
        },
        classificationId(neo) {
            if (neo && this.search.length >= 3) this.launchSearch()
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

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

export default {
    name: 'TagResults',

    emits: ['go-back', 'add-tag'],

    components: {
        SearchResults,
        LoaderSimple,
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
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
                const req = await getOrgClassificationTags(
                    this.organizationsStore.current.code,
                    this.classificationId,
                    { search: this.search }
                ).catch(() => ({
                    results: [],
                }))
                this.tagResults = req.results
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

<template>
    <div class="page-section-extra-wide page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('common.people')) }}</h1>
        <div class="main-ctn">
            <div v-if="searchOptionsInitiated" class="search-input-container">
                <SearchOptions
                    :limit="30"
                    :search="search"
                    section="people"
                    show-filters
                    @search-options-updated="updateSearch"
                />
            </div>

            <GlobalSearchTab :search="rawSearch" />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'

import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'PeoplePage',

    components: {
        SearchOptions,
        GlobalSearchTab,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    data() {
        return {
            search: {
                search: '',
                categories: [],
                tags: [],
                members: [],
                sdgs: [],
                languages: [],
                skills: [],
                section: 'all',
                organizations: [this.organizationsStore.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: 1,
            },
            projectsCount: 0,
            searchOptionsInitiated: false,
            filterQueryParams: ['search', 'sdgs', 'skills', 'page'],
            selectedSection: 'all',
        }
    },

    computed: {
        rawSearch() {
            return JSON.parse(JSON.stringify(this.search))
        },
    },

    async mounted() {
        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInitiated = true
        this.selectedSection = this.$route.query.section
    },

    methods: {
        updateSearch: debounce(function (newSearch) {
            // reset pagination to page 1 if other criterion have changed
            // { ...this.search, ...newSearch } is needed as SearchOptions emitted value dont have some params like limit
            // and so seem always different than this.search
            const search = resetPaginationIfNeeded(this.search, {
                ...this.search,
                ...newSearch,
            })
            this.search = search
            this.updateSearchQuery()
        }, 500),

        updateSearchQuery() {
            return updateSearchQuery(this, this.filterQueryParams)
        },
    },
}
</script>

<style lang="scss" scoped>
.main-ctn {
    display: flex;
    flex-direction: column;

    .search-input-container {
        display: flex;
        padding: $space-l;
        background: $primary-lighter;
        align-items: center;
        border-radius: $border-radius-17;
        flex-direction: column;
        margin: $space-xl 0;

        .search-input {
            margin-bottom: pxToRem(16px);
        }

        @media screen and (min-width: $min-tablet) {
            padding: pxToRem(32px) pxToRem(84px);
            border-radius: 17px;
            flex-direction: row;

            .search-input {
                margin-right: $space-l;
                margin-bottom: 0;
            }
        }
    }
}

:deep(.search-input-ctn),
:deep(.search-block) {
    flex-grow: 1;
}
</style>

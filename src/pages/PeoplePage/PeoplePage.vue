<template>
    <div class="people-layout">
        <h1 class="title">{{ $filters.capitalize($t('common.people')) }}</h1>
        <div class="main-ctn">
            <div v-if="searchOptionsInitiated" class="search-input-container">
                <SearchOptions
                    :limit="30"
                    :show-section-filter="false"
                    :search="search"
                    section="people"
                    :show-filters="true"
                    @filter-total-changed="updateFilterTotal($event)"
                    @filters-updated="updateSearch($event)"
                />
            </div>

            <PeopleSearchTab :search="rawSearch" />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'

import PeopleSearchTab from '@/components/Layouts/Search/Tabs/PeopleSearchTab.vue'

export default {
    name: 'PeoplePage',

    components: {
        SearchOptions,
        PeopleSearchTab,
    },

    data() {
        return {
            search: {
                search: '',
                categories: [],
                organization_tags: [],
                wikipedia_tags: [],
                members: [],
                sdgs: [],
                languages: [],
                skills: [],
                section: 'all',
                organizations: [this.$store.state.organizations.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: 1,
            },
            filterTotal: 0,
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
        updateFilterTotal(filterTotal) {
            this.filterTotal = filterTotal
        },

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
.people-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: $space-2xl;

    @media screen and (min-width: $min-tablet) {
        margin-top: calc($space-2xl * 2);
    }
}

.title {
    text-align: center;
    font-weight: 700;
    font-size: $font-size-5xl;
    line-height: 50px;
    color: $black;
    width: 100%;
    margin-bottom: $space-m;
}

.main-ctn {
    display: flex;
    flex-direction: column;
    max-width: 1400px;

    .search-input-container {
        display: flex;
        padding: $space-l;
        margin: $space-xl;
        background: #ebfffa;
        align-items: center;
        border-radius: $border-radius-17;
        flex-direction: column;

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

<template>
    <div class="page-section-extra-wide page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('common.people')) }}</h1>
        <div class="main-ctn">
            <div v-if="searchOptionsInitiated" class="search-input-container">
                <SearchOptions
                    :limit="30"
                    :search="search"
                    section="people"
                    @search-options-updated="updateSearch"
                />
            </div>

            <GlobalSearchTab :search="rawSearch" />
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useSearch from '@/composables/useSearch.js'

export default {
    name: 'PeoplePage',

    components: {
        SearchOptions,
        GlobalSearchTab,
    },
    setup() {
        const {
            search,
            searchOptionsInitiated,
            selectedSection,
            filterQueryParams,
            rawSearch,
            initSearch,
            updateSearchQuery,
            updateSearch,
        } = useSearch()
        return {
            search,
            searchOptionsInitiated,
            selectedSection,
            filterQueryParams,
            rawSearch,
            initSearch,
            updateSearchQuery,
            updateSearch,
        }
    },
    data() {
        return {
            // TODO ???
            projectsCount: 0,
        }
    },

    async mounted() {
        await this.initSearch()
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

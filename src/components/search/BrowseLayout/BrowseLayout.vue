<template>
    <div class="page-section-extra-wide browse-layout">
        <div v-if="searchOptionsInitiated" class="browse-header">
            <SearchOptions
                :limit="30"
                show-section-filter
                show-filters
                :search="search"
                @search-options-updated="updateSearch"
            />
        </div>

        <GlobalSearchTab :search="rawSearch" />
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'

import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'BrowseLayout',

    mixins: [onboardingStatusMixin],

    inject: {
        browseLayoutUpdateProjectQuantity: {
            from: 'browseLayoutUpdateProjectQuantity',
            default: () => {},
        },
    },

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
                organization_tags: [],
                wikipedia_tags: [],
                members: [],
                sdgs: [],
                languages: [],
                skills: [],
                section: ALL_SECTION_KEY,
                organizations: [this.organizationsStore.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: 1,
            },
            projectsCount: 0,
            searchOptionsInitiated: false,

            selectedSection: ALL_SECTION_KEY,
        }
    },

    provide() {
        return {
            browseLayoutUpdateProjectQuantity: this.updateProjectQuantity,
        }
    },

    async mounted() {
        const section = this.$route.query.section

        // safeguard against smartpants who play with their URL and risk section / routes mismatch
        const routesFromSection = {
            projects: 'ProjectSearch',
            groups: 'GroupSearch',
            people: 'PeopleSearch',
        }
        if (
            section &&
            routesFromSection[section] &&
            routesFromSection[section] !== this.$route.name
        ) {
            // section does not match current route, redirect to correct route
            this.$router.push({ name: routesFromSection[section], query: this.$route.query })
        }

        // selectedSection must be inited first as it determines filterQueryParams
        this.selectedSection = section

        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInitiated = true

        this.onboardingTrap('explore_projects', false)
    },

    computed: {
        filterQueryParams() {
            // compute allowed filters according to current section
            // so that filter of one section (ie skills on people) dont persist on other section (ie skills on project)
            const map = {
                search: true,
                categories: this.selectedSection === 'projects',
                organization_tags: this.selectedSection === 'projects',
                wikipedia_tags: this.selectedSection === 'projects',
                members: false,
                sdgs: this.selectedSection === 'projects' || this.selectedSection === 'people',
                languages: this.selectedSection === 'projects',
                skills: this.selectedSection === 'people',
                page: true,
                section: true,
            }

            return Object.keys(map).filter((key) => map[key])
        },
        rawSearch() {
            return JSON.parse(JSON.stringify(this.search))
        },
    },

    methods: {
        updateProjectQuantity(quantity) {
            this.projectsCount = quantity
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
.browse-layout {
    padding-top: pxToRem(74px);

    .tab {
        margin-top: $space-l;
    }
}

.browse-header {
    display: block;
    background-color: $primary-lighter;
    padding: $space-xl 0;
    padding: 1rem;
}

.project-list__header {
    display: flex;
    flex-direction: column;
    margin-bottom: $space-l;

    .header__title {
        grid-column: 2 / 3;
        place-self: center center;
        font-size: $font-size-3xl;
        font-weight: 700;
        margin: $space-m 0 $space-m 0;
        text-transform: uppercase;
        color: $almost-black;
    }
}

@media only screen and (width >= 1000px) {
    .project-list__header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 0;
    }

    .header__title {
        margin: 0;
    }
}
</style>

<template>
    <div class="browse-layout">
        <div v-if="searchOptionsInitiated" class="browse-header">
            <SearchOptions
                :limit="30"
                :show-section-filter="true"
                :search="search"
                :section="$route.query.section || 'all'"
                :show-section-drop-down="true"
                @filter-total-changed="updateFilterTotal($event)"
                @filters-updated="updateSearch($event)"
                @filter-section-update="updateTabs($event)"
            />
        </div>

        <TabsLayout
            v-if="searchOptionsInitiated"
            :border="false"
            :tabs="tabs"
            class="tab"
            router-view
        />
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'

export default {
    name: 'BrowseLayout',

    inject: {
        browseLayoutUpdateProjectQuantity: {
            from: 'browseLayoutUpdateProjectQuantity',
            default: () => {},
        },
    },

    components: {
        SearchOptions,
        TabsLayout,
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

            selectedSection: 'all',
        }
    },

    provide() {
        return {
            browseLayoutUpdateProjectQuantity: this.updateProjectQuantity,
        }
    },

    async mounted() {
        // selectedSection must be inited first as it determines filterQueryParams
        this.selectedSection = this.$route.query.section
        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInitiated = true
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
        tabs() {
            const query = { ...this.search }
            return [
                {
                    key: 'search-list-tab',
                    label: this.projectsCount
                        ? this.$t('search.search-tab')
                        : this.$t('search.all'),
                    view: { name: 'GlobalSearch', query },
                    condition: this.selectedSection === 'all',
                    props: { search: this.rawSearch },
                },
                {
                    key: 'projects-list-tab',
                    label: this.projectsCount
                        ? this.$t('search.projects-tab')
                        : this.$t('search.projects-tab-label'),
                    view: { name: 'ProjectSearch', query },
                    condition:
                        this.selectedSection === 'projects' || this.selectedSection === 'all',
                    props: { search: this.rawSearch },
                },
                {
                    key: 'groups-list-tab',
                    label: this.projectsCount
                        ? this.$t('search.group-tab')
                        : this.$t('search.groups'),
                    view: { name: 'GroupSearch', query },
                    condition: this.selectedSection === 'groups' || this.selectedSection === 'all',
                    props: { search: this.rawSearch },
                },
                {
                    key: 'people-list-tab',
                    label: this.projectsCount
                        ? this.$t('search.people-tab')
                        : this.$t('search.peoples'),
                    view: { name: 'PeopleSearch', query },
                    condition: this.selectedSection === 'people' || this.selectedSection === 'all',
                    props: { search: this.rawSearch },
                },
            ].filter((tab) => tab.condition)
        },
    },

    methods: {
        updateFilterTotal(filterTotal) {
            this.filterTotal = filterTotal
        },

        updateTabs(section) {
            this.selectedSection = section && section.type ? section.type : 'all'
            this.search.section = section && section.type ? section.type : 'all'

            if (!section || !section.type || section.type === (this.$route.query.section || 'all'))
                return

            const query = { ...this.$route.query, section: section.type }

            if (this.selectedSection === 'all') this.$router.push({ name: 'GlobalSearch', query })
            if (this.selectedSection === 'projects')
                this.$router.push({ name: 'ProjectSearch', query })
            if (this.selectedSection === 'groups') this.$router.push({ name: 'GroupSearch', query })
            if (this.selectedSection === 'people')
                this.$router.push({ name: 'PeopleSearch', query })
        },

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
    width: 100%;
    max-width: 85rem;
    margin: 0 auto;
    box-sizing: border-box;

    .tab {
        margin-top: $space-l;
    }
}

.browse-header {
    display: block;
    background-color: $primary-lighter;
    padding: $space-xl 0;
}

.project-list__header {
    display: flex;
    flex-direction: column;
    margin-bottom: $space-l;

    .header__title {
        grid-column: 2 / 3;
        justify-self: center;
        align-self: center;
        font-size: $font-size-3xl;
        font-weight: 700;
        margin: $space-m 0 $space-m 0;
        text-transform: uppercase;
        color: $dark;
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

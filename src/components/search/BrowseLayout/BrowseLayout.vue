<template>
    <div class="page-section-extra-wide browse-layout">
        <div class="browse-header">
            <SearchOptions :limit="30" show-section-filter />
        </div>

        <GlobalSearchTab :search="searchFromQuery" />
    </div>
</template>

<script>
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useSearch from '@/composables/useSearch.js'

export default {
    name: 'BrowseLayout',

    mixins: [onboardingStatusMixin],

    // inject: {
    //     browseLayoutUpdateProjectQuantity: {
    //         from: 'browseLayoutUpdateProjectQuantity',
    //         default: () => {},
    //     },
    // },

    components: {
        SearchOptions,
        GlobalSearchTab,
    },

    setup() {
        const { searchFromQuery } = useSearch(null)
        return { searchFromQuery }
    },
    // data() {
    //     return {
    //         projectsCount: 0,
    //     }
    // },

    // provide() {
    //     return {
    //         browseLayoutUpdateProjectQuantity: this.updateProjectQuantity,
    //     }
    // },

    async mounted() {
        // const section = this.$route.query.section

        // // safeguard against smartpants who play with their URL and risk section / routes mismatch
        // const routesFromSection = {
        //     projects: 'ProjectSearch',
        //     groups: 'GroupSearch',
        //     people: 'PeopleSearch',
        // }
        // if (
        //     section &&
        //     routesFromSection[section] &&
        //     routesFromSection[section] !== this.$route.name
        // ) {
        //     // section does not match current route, redirect to correct route
        //     this.$router.push({ name: routesFromSection[section], query: this.$route.query })
        // }

        // // selectedSection must be inited first as it determines filterQueryParams
        // // TODO not .value ????
        // this.selectedSection = section

        // await this.initSearch()

        this.onboardingTrap('explore_projects', false)
    },

    // methods: {
    //     updateProjectQuantity(quantity) {
    //         this.projectsCount = quantity
    //     },
    // },
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

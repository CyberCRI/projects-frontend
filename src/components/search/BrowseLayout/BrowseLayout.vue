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

    components: {
        SearchOptions,
        GlobalSearchTab,
    },

    setup() {
        const { searchFromQuery } = useSearch(null)
        return { searchFromQuery }
    },

    async mounted() {
        this.onboardingTrap('explore_projects', false)
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

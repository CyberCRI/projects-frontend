<template>
    <div v-if="categories.length > 0" class="categories-layout page-top">
        <div class="page-section-extra-wide">
            <h1 class="page-title">{{ $filters.capitalize($t('projects')) }}</h1>

            <div v-if="searchOptionsInitiated" class="search-input-container">
                <SearchOptions
                    ref="searchOptions"
                    :limit="30"
                    :search="search"
                    section="projects"
                    show-filters
                    @search-options-updated="updateSearch"
                />
            </div>
        </div>

        <div v-if="canCreateProject" class="action-ctn page-section-extra-wide">
            <LpiButton
                :label="$t('project.create-project')"
                btn-icon="Plus"
                secondary
                @click="$router.push({ name: 'createProject' })"
                data-test="create-project"
            />
        </div>

        <div class="page-section-wide" v-if="hasSearch || forceSearch">
            <GlobalSearchTab :search="search" />
            <div class="btn-ctn">
                <LpiButton :label="$t('category.all-categories')" @click="showCategories" />
            </div>
        </div>
        <template v-else>
            <div class="title-ctn page-section-wide">
                <h2 class="sub-title">
                    {{ $filters.capitalize($t('home.categories.title')) }}
                </h2>
            </div>
            <div class="categories page-section-wide">
                <LpiCategoryCard
                    v-for="(category, index) in categories"
                    :key="index"
                    :category="category"
                    class="category"
                    size="small"
                    @click="goTo"
                />
            </div>

            <div class="btn-ctn">
                <LpiButton :label="$t('category.all-projects')" @click="forceSearch = true" />
            </div>
        </template>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import LpiCategoryCard from '@/components/category/LpiCategoryCard.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'CategoriesPage',

    mixins: [permissions],

    components: {
        LpiButton,
        LpiCategoryCard,
        SearchOptions,
        GlobalSearchTab,
    },

    setup() {
        const projectCategoriesStore = useProjectCategories()
        const organizationsStore = useOrganizationsStore()
        return {
            projectCategoriesStore,
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
            filterQueryParams: ['search', 'sdgs', 'categories', 'tags', 'languages', 'page'],
            selectedSection: 'all',
            forceSearch: false,
        }
    },

    async mounted() {
        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInitiated = true
        this.selectedSection = this.$route.query.section
    },

    computed: {
        categories() {
            return this.projectCategoriesStore.hierarchy
        },

        hasSearch() {
            return (
                !!this.search.search ||
                ['sdgs', 'categories', 'tags', 'languages'].reduce(
                    (acc, key) => acc || this.search[key].length > 0,
                    false
                )
            )
        },
    },

    methods: {
        goTo(id) {
            this.$router.push({ name: 'Category', params: { id } })
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
        showCategories() {
            this.$refs['searchOptions']?.deleteQuery()
            this.$refs['searchOptions']?.clearSelectedFilters()
            this.forceSearch = false
            this.$nextTick(() => {
                this.$el?.querySelector('.page-title')?.scrollIntoView({ behavior: 'smooth' })
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.categories-layout {
    .btn-ctn {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $space-2xl 0;
    }

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

    :deep(.search-input-ctn),
    :deep(.search-block) {
        flex-grow: 1;
    }

    .action-ctn {
        text-align: right;

        button {
            margin-left: auto;
        }
    }

    .sub-title {
        text-align: center;
        font-weight: 700;
        font-size: $font-size-2xl;
        line-height: $line-height-tight;
        color: $black;
        width: 100%;
    }

    .title-ctn {
        margin-bottom: $space-xl;
        width: 100%;
    }

    .categories {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: stretch;

        .category {
            margin: $space-xs;
        }
    }
}
</style>

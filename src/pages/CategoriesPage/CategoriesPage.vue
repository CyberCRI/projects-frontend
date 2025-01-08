<template>
    <div v-if="categories.length > 0" class="categories-layout page-top">
        <div class="page-section-extra-wide">
            <h1 class="page-title">{{ $filters.capitalize($t('projects')) }}</h1>

            <div class="search-input-container">
                <SearchOptions ref="searchOptions" :limit="30" section="projects" />
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
            <GlobalSearchTab :search="fixedSearch" />
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
                <CategoryCard
                    v-for="(category, index) in categories"
                    :key="index"
                    :category="category"
                    class="category"
                />
            </div>

            <div class="btn-ctn">
                <LpiButton :label="$t('category.all-projects')" @click="forceSearch = true" />
            </div>
        </template>
    </div>
</template>

<script>
import CategoryCard from '@/components/category/CategoryCard.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useSearch from '@/composables/useSearch.js'

export default {
    name: 'CategoriesPage',

    mixins: [permissions],

    components: {
        LpiButton,
        CategoryCard,
        SearchOptions,
        GlobalSearchTab,
    },

    setup() {
        const projectCategoriesStore = useProjectCategories()
        const { searchFromQuery } = useSearch('projects')
        return {
            projectCategoriesStore,
            searchFromQuery,
        }
    },

    data() {
        return {
            forceSearch: false,
        }
    },

    computed: {
        categories() {
            return this.projectCategoriesStore.hierarchy
        },

        hasSearch() {
            return (
                !!this.searchFromQuery.search ||
                ['sdgs', 'categories', 'tags', 'languages'].reduce(
                    (acc, key) => acc || this.searchFromQuery[key]?.length > 0,
                    false
                )
            )
        },
        fixedSearch() {
            return {
                ...this.searchFromQuery,
                section: 'projects',
            }
        },
    },

    methods: {
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
        gap: $space-l;
    }
}
</style>

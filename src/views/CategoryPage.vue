<template>
    <div v-if="category" id="type" :key="category.id" class="category-layout">
        <div class="breadcrumbs-ctn">
            <BreadCrumbs :breadcrumbs="categoryHierarchy || []" />
        </div>
        <header class="banner-ctn">
            <div class="banner">
                <CategoryCardImage
                    :background-color="category.background_color"
                    :url="imageSource"
                    image-height="433px"
                    image-width="100%"
                />
            </div>

            <div class="banner-title-ctn">
                <div class="banner-title">
                    <h1 class="category-name">{{ category.name }}</h1>
                    <p class="category-description" v-html="category.description" />
                    <div class="category-search">
                        <SearchOptions
                            ref="searchOptions"
                            v-if="searchOptionsInited"
                            :search="search"
                            :show-filters="false"
                            class="container inline stretch"
                            @enter="updateSearch($event)"
                            section="projects"
                        />
                        <LpiButton
                            :label="$t('search.search-title')"
                            class="button"
                            @click="updateSearch($refs.searchOptions.selectedFilters)"
                            data-test="create-project-from-category"
                        />
                    </div>
                </div>
            </div>
        </header>

        <div class="category-body narrow-body">
            <div class="category-search-header">
                <LpiButton
                    v-if="canCreateProject"
                    :label="$t('project.create-project')"
                    class="button"
                    left-icon="Plus"
                    secondary
                    @click="
                        $router.push({
                            name: 'createProject',
                            query: { category: category.id },
                        })
                    "
                    data-test="create-project-from-category"
                />
            </div>
            <ProjectListSearch
                v-if="searchOptionsInited"
                :page="search.page"
                :search="search"
                :show-pagination="true"
                :show-search-slot="true"
                class="project-list-search"
                mode="projects"
                @pagination-changed="onPaginationChange"
            >
                <template #default="ProjectListSearchSlotProps">
                    <CardList
                        :is-loading="ProjectListSearchSlotProps.isLoading"
                        :limit="ProjectListSearchSlotProps.limit"
                        :projects="ProjectListSearchSlotProps.projects"
                        :total-count="ProjectListSearchSlotProps.totalCount"
                        :with-title="true"
                        desktop-columns-number="6"
                    >
                        <template #projects="projectListSlotProps">
                            <ProjectCard :project="projectListSlotProps.project" />
                        </template>
                    </CardList>
                </template>
            </ProjectListSearch>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapGetters } from 'vuex'
import store from '@/store'
import formatHtml from '@/mixins/formatHtml.ts'
import pageTitle from '@/mixins/pageTitle.ts'

import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import CategoryCardImage from '@/components/lpikit/CategoryCard/CategoryCardImage.vue'
import ProjectListSearch from '@/components/lpikit/ProjectListSearch/ProjectListSearch.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'

export default {
    name: 'CategoryPage',

    mixins: [formatHtml, pageTitle, permissions],

    components: {
        LpiButton,
        ProjectListSearch,
        CardList,
        SearchOptions,
        ProjectCard,
        CategoryCardImage,
        BreadCrumbs,
    },

    pageTitle() {
        return this.$t('category.page-title') + (this.category ? ' ' + this.category.name : '')
    },
    data() {
        return {
            addProjectModalActive: false,
            search: {
                search: this.$route.query.search || '',
                categories: [this.id],
                tags: [],
                members: [],
                languages: [],
                sdgs: [],
                organizations: [this.$store.state.organizations.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: this.$route.query.page || 1,
            },
            searchOptionsInited: false,
            filterQueryParams: ['search', 'page'],
            query: '',
        }
    },

    computed: {
        ...mapGetters({
            getProjectCategoryById: 'projectCategories/getOneById',
        }),

        category() {
            if (this.$route.params.id) {
                window.scrollTo(0, 0)
                return this.getProjectCategoryById(this.$route.params.id)
            }

            return null
        },

        imageSource() {
            if (this.category.background_image)
                return this.category.background_image.variations.large
            else return null
        },

        categoryHierarchy() {
            return [
                {
                    name: this.$t('home.home'),
                    route: { name: 'HomeRoot' },
                },
                {
                    name: this.$t('category.title'),
                    route: { name: 'Categories' },
                },
                {
                    name: this.category.name,
                    route: { name: 'Category', params: { id: this.category.id } },
                },
            ]
        },
    },

    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },

    async created() {
        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInited = true
    },

    mounted() {
        this.$store.dispatch('app/updateLoading', { visible: false })
    },

    beforeUnmount() {
        document.title = 'Projects'
    },

    methods: {
        onPaginationChange(pagination) {
            if (
                this.search.page == pagination.currentPage ||
                (!this.search.page && pagination.currentPage == 1)
            )
                return
            this.search.page = pagination.currentPage
            this.$router.push({
                path: this.$route.path,
                query: { ...this.$route.query, page: pagination.currentPage },
            })
        },

        updateSearch(newSearch) {
            // reset pagination to page 1 if other criterion have changed
            // { ...this.search, ...newSearch } is needed as SearchOptions emitted value dont have some params like limit
            // and so seem always different than this.search
            const search = resetPaginationIfNeeded(this.search, {
                ...this.search,
                ...newSearch,
            })
            this.search = search
            this.updateSearchQuery()
        },

        updateSearchQuery: debounce(function () {
            return updateSearchQuery(this, this.filterQueryParams)
        }, 500),
    },

    beforeRouteEnter(to, from, next) {
        // if it is the first page navigated (deep link), categories are not initialized yet
        // so prevent navigation before it is
        if (!store.state.projectCategories.all || !store.state.projectCategories.all.length) {
            store.dispatch('projectCategories/getAllProjectCategories').then(() => next())
        } else {
            next()
        }
    },
}
</script>

<style lang="scss" scoped>
.category-search-header {
    color: $primary-dark;
    font-size: $font-size-m;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: $space-l 0;

    @media screen and (max-width: $max-tablet) {
        margin: $space-l;
    }

    .search-by {
        margin-right: $space-m;
    }

    @media screen and (min-width: $max-tablet) {
        justify-content: flex-end;
    }

    :deep(.lpi-select) {
        margin-left: $space-m;
    }

    &--search-input {
        justify-content: space-between;
        padding: $space-l;
    }
}

.category-layout {
    display: flex;
    flex-direction: column;
    position: relative;

    .banner-ctn {
        position: relative;
    }

    .breadcrumbs-ctn {
        padding-left: $space-xl;
        margin-top: $navbar-height;
    }

    .banner {
        width: 100%;
        z-index: -1;
        left: 0;
        position: relative;

        &-title-ctn {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 60%;
            padding: $space-xl $space-l;
            background: rgb(255 255 255 / 75%);
            border-radius: $border-radius-l;

            @media screen and (max-width: $max-tablet) {
                width: 100%;
            }

            .category-name {
                font-weight: 700;
                font-size: $font-size-5xl;
                line-height: 1.2;
                text-align: center;
                margin-bottom: $space-m;
            }

            .category-description {
                font-size: $font-size-m;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 7;
            }

            .category-search {
                box-sizing: border-box;
                display: flex;
                justify-content: stretch;
                align-items: center;
                gap: $space-unit;
                width: 100%;
                margin-top: $space-l;
                flex-direction: row;

                @media screen and (max-width: $min-tablet) {
                    flex-direction: column;
                }

                .search-block {
                    flex-grow: 1;
                }

                .button {
                    text-transform: capitalize;
                }
            }
        }
    }

    .search-block.inline {
        padding-right: 0;
    }
}
</style>

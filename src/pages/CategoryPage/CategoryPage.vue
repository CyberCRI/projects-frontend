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
                            class="container inline stretch"
                            @search-options-updated="updateSearch"
                            section="projects"
                            :filter-black-list="['categories']"
                        />
                    </div>
                </div>
            </div>
        </header>

        <div class="category-body page-section-extra-wide">
            <div class="category-search-header">
                <LpiButton
                    v-if="canCreateProject"
                    :label="$t('project.create-project')"
                    class="button"
                    btn-icon="Plus"
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
            <ProjectSearchTab :search="search" />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapGetters } from 'vuex'
import store from '@/store'
import formatHtml from '@/mixins/formatHtml.ts'
import pageTitle from '@/mixins/pageTitle.ts'

import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'

import ProjectSearchTab from '@/pages/SearchPage/Tabs/ProjectSearchTab.vue'

export default {
    name: 'CategoryPage',

    mixins: [formatHtml, pageTitle, permissions],

    components: {
        LpiButton,
        SearchOptions,
        CategoryCardImage,
        BreadCrumbs,
        ProjectSearchTab,
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
            filterQueryParams: [
                'search',
                'sdgs',
                'organization_tags',
                'wikipedia_tags',
                'languages',
                'page',
            ],
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

    beforeUnmount() {
        document.title = 'Projects'
    },

    methods: {
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
            padding: 0 $space-l;
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
                line-height: $line-height-tight;
                text-align: center;
                margin-bottom: $space-m;
            }

            .category-description {
                font-size: $font-size-m;
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

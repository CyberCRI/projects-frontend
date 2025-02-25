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
                    :image-sizes="imageSizes"
                />
            </div>

            <div class="banner-title-ctn">
                <div class="banner-title">
                    <h1 class="category-name">{{ category.name }}</h1>
                    <p class="category-description" v-html="category.description" />
                    <div class="category-search">
                        <SearchOptions
                            ref="searchOptions"
                            class="container inline stretch"
                            section="projects"
                            :filter-black-list="['categories']"
                        />
                    </div>
                </div>
            </div>
        </header>

        <div class="category-body page-section-extra-wide">
            <div class="category-children" v-if="sortedChildren.length">
                <NuxtLink
                    :to="{ name: 'Category', params: { id: child.id } }"
                    v-for="child in sortedChildren"
                    class="category-child shadow-box"
                    :key="child.id"
                >
                    <h3 class="child-title">{{ child.name }}</h3>
                </NuxtLink>
            </div>
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
            <GlobalSearchTab :search="fixedSearch" />
        </div>
    </div>
</template>

<script>
import formatHtml from '@/mixins/formatHtml.ts'
import pageTitle from '@/mixins/pageTitle.ts'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useSearch from '@/composables/useSearch.js'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'CategoryPage',

    mixins: [formatHtml, pageTitle, permissions],

    components: {
        LpiButton,
        SearchOptions,
        CategoryCardImage,
        BreadCrumbs,
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

    pageTitle() {
        return this.$t('category.page-title') + (this.category ? ' ' + this.category.name : '')
    },
    data() {
        return {
            addProjectModalActive: false,
        }
    },

    computed: {
        imageSizes() {
            const bgImage = this.category?.background_image
            return (bgImage && pictureApiToImageSizes(bgImage)) || null
        },
        sortedChildren() {
            return [...this.category.children]?.sort((a, b) => a.order_index - b.oreder_index) || []
        },

        category() {
            if (this.id) {
                if (import.meta.client) window.scrollTo(0, 0)
                return this.projectCategoriesStore.allByIds[this.$route.params.id]
            }

            return null
        },

        imageSource() {
            if (this.category.background_image)
                return this.category.background_image.variations.full
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
                ...(this.category.hierarchy || []).map((cat) => ({
                    name: cat.name,
                    route: { name: 'Category', params: { id: cat.id } },
                })),
                {
                    name: this.category.name,
                    route: { name: 'Category', params: { id: this.category.id } },
                },
            ]
        },

        fixedSearch() {
            return {
                ...this.searchFromQuery,
                categories: [this.category?.id],
                section: 'projects',
            }
        },
    },

    props: {
        id: {
            type: [String, Number],
            required: true,
        },
    },
    beforeUnmount() {
        document.title = 'Projects'
    },

    beforeRouteEnter(_to, _from, next) {
        // if it is the first page navigated (deep link), categories are not initialized yet
        // so prevent navigation before it is
        const projectCategoriesStore = useProjectCategories()
        if (!projectCategoriesStore.all || !projectCategoriesStore.all.length) {
            projectCategoriesStore.getAllProjectCategories().then(() => next())
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

.category-children {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: $space-2xl;

    @media screen and (min-width: $min-tablet) {
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (min-width: $min-desktop) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .category-child {
        display: inline-block;
        padding: $space-m;
        border: $border-width-s solid $primary;
        border-radius: $border-radius-s;
        background-color: $white;

        .child-title {
            font-weight: 700;
            color: $almost-black;
            font-size: $font-size-l;
            line-height: 1.4;
        }
    }
}
</style>

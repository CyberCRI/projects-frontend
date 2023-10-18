<template>
    <div v-if="categories.length > 0" class="categories-layout">
        <h1 class="title">{{ $filters.capitalize($t('projects')) }}</h1>

        <div class="search-categories-ctn page-section-extra-wide">
            <div class="search-input-container">
                <SearchInput
                    v-model="searchFilter.search"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    class="search-input"
                    @enter="updateSearchQuery(true)"
                    @delete-query="searchFilter.search = ''"
                />
                <LpiButton
                    :label="$t('browse.page-title')"
                    :secondary="false"
                    @click="updateSearchQuery(true)"
                />
            </div>
        </div>

        <div v-if="canCreateProject" class="action-ctn page-section-extra-wide">
            <LpiButton
                :label="$t('project.create-project')"
                size="link"
                class="button"
                left-icon="Plus"
                secondary
                @click="$router.push({ name: 'createProject' })"
                data-test="create-project"
            />
        </div>

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
            <LpiButton :label="$t('category.all-projects')" @click="updateSearchQuery" />
        </div>
    </div>
</template>

<script>
import LpiCategoryCard from '@/components/lpikit/CategoryCard/LpiCategoryCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'CategoriesPage',

    mixins: [permissions],

    components: {
        SearchInput,
        LpiButton,
        LpiCategoryCard,
    },

    data() {
        return {
            searchFilter: {
                search: '',
                section: 'projects',
            },
        }
    },

    computed: {
        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },
    },

    methods: {
        goTo(id) {
            this.$router.push({ name: 'Category', params: { id } })
        },

        updateSearchQuery(searchButton) {
            if (searchButton)
                this.$router.push({
                    name: 'ProjectSearch',
                    query: { ...this.searchFilter, section: 'projects' },
                })
            else
                this.$router.push({
                    name: 'Search',
                    query: { section: 'projects' },
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.categories-layout {
    margin-top: $space-2xl;

    .btn-ctn {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $space-2xl 0;
    }

    .search-categories-ctn {
        display: flex;
        flex-direction: column;

        .search-input-container {
            display: flex;
            padding: $space-l;
            margin: $space-xl 0;
            background: #ebfffa;
            align-items: center;
            border-radius: $border-radius-17;
            flex-direction: column;

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

    @media screen and (min-width: $min-tablet) {
        margin-top: calc($space-2xl * 2);
    }

    .action-ctn {
        text-align: right;

        button {
            margin-left: auto;
        }
    }

    .title {
        text-align: center;
        font-weight: 700;
        font-size: $font-size-5xl;
        line-height: 50px;
        color: $black;
        width: 100%;
        margin-bottom: $space-m;
    }

    .sub-title {
        text-align: center;
        font-weight: 700;
        font-size: $font-size-2xl;
        line-height: 30px;
        color: $black;
        width: 100%;
    }

    .title-ctn {
        display: inline-flex;
        flex-direction: column;
        margin-bottom: $space-xl;
        width: 100%;

        @media screen and (min-width: $min-tablet) {
            flex-direction: row;
        }
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

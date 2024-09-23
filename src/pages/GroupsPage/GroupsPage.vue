<template>
    <div class="page-section-extra-wide groups-layout page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('common.groups')) }}</h1>

        <div v-if="!groupId && searchOptionsInitiated" class="search-input-container">
            <SearchOptions
                :limit="30"
                ref="searchOptions"
                :search="search"
                section="groups"
                show-filters
                @search-options-updated="updateSearch"
            />
        </div>
        <div class="page-section-wide" v-if="hasSearch">
            <GlobalSearchTab :search="search" />
            <div class="btn-ctn">
                <LpiButton :label="$t('people-groups.browse-tree')" @click="showCategories" />
            </div>
        </div>
        <template v-else>
            <div class="current-group-ctn">
                <div class="breadcrumb">
                    <BreadCrumbs
                        v-if="hierarchy?.length"
                        :breadcrumbs="hierarchy"
                        group-name=""
                        :is-loading="isLoading"
                    />
                </div>
                <div class="current-group">
                    <h3 v-if="!isLoading && currentGroup">
                        {{ currentGroup.name }} ({{ currentGroup.children.length }})
                    </h3>
                    <template v-if="isLoading">
                        <SkeletonComponent width="110px" class="current-group-skeleton" />
                        <SkeletonComponent width="40px" class="current-group-skeleton" />
                    </template>
                </div>

                <div class="groups-list">
                    <CardList
                        :desktop-columns-number="6"
                        :is-loading="isLoading"
                        :limit="12"
                        :items="childGroup"
                        class="list-container"
                    >
                        <template #default="cardListSlotProps">
                            <GroupCard
                                :group="cardListSlotProps.item"
                                :has-sub-groups-link="!!cardListSlotProps.item?.children?.length"
                            />
                        </template>
                    </CardList>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import debounce from 'lodash.debounce'
import { getHierarchyGroups } from '@/api/groups.service.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions'
import CardList from '@/components/base/CardList.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import {
    updateFiltersFromURL,
    updateSearchQuery,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'

export default {
    name: 'GroupsPage',

    mixins: [permissions],

    components: {
        LpiButton,
        CardList,
        GroupCard,
        BreadCrumbs,
        SkeletonComponent,
        SearchOptions,
        GlobalSearchTab,
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    props: {
        groupId: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            isLoading: true,
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
                organizations: [this.organizationsStore.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: 1,
            },
            groupsIndex: null,
            rootId: null,
            searchOptionsInitiated: false,
            filterQueryParams: [
                'search',
                'sdgs',
                'categories',
                'organization_tags',
                'wikipedia_tags',
                'languages',
                'page',
            ],
            selectedSection: 'all',
        }
    },

    async mounted() {
        Object.assign(
            this.search,
            await updateFiltersFromURL(this.$route.query, this.filterQueryParams)
        )
        this.searchOptionsInitiated = true
        this.selectedSection = this.$route.query.section
        await this.loadGroups()
    },

    computed: {
        currentGroup() {
            if (!this.groupsIndex) return null
            if (!this.groupId) return this.groupsIndex[this.rootId]
            return this.groupsIndex[this.groupId]
        },

        childGroup() {
            return (this.currentGroup?.children || [])
                .map((gid) => this.groupsIndex[gid])
                .sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1

                    return 0
                })
        },

        hierarchy() {
            return (this.currentGroup?.hierarchy || []).map((groupId) => this.groupsIndex[groupId])
        },

        hasSearch() {
            return !!this.search.search
            // keep for future development
            // array to be populated with search filters keys for groups when ther'll be some
            // ||
            // [].reduce((acc, key) => acc || this.search[key].length > 0, false)
        },
    },

    watch: {
        currentGroup: {
            handler: function (neo) {
                if (!neo && this.groupsIndex && this.groupId) {
                    this.$router.push({
                        name: 'Groups',
                    })
                }
            },
        },
    },

    methods: {
        async loadGroups() {
            this.isLoading = true
            const groups = await getHierarchyGroups(this.organizationsStore.current.code)
            this.rootId = groups.id
            this.buildIndex(groups)
            this.isLoading = false
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

        buildIndex(groups) {
            const index = {}
            const iterate = (subgroups, hierarchy) => {
                subgroups.forEach((group) => {
                    const route = {
                        name: 'Groups',
                    }
                    if (hierarchy.length !== 0) {
                        route.params = {
                            groupId: group.id,
                        }
                    }
                    index[group.id] = {
                        ...group,
                        hierarchy: [...hierarchy],
                        route,
                        children: group.children?.map((g) => g.id) || [],
                    }
                    // use group id in hierachy an rehydrate when needed
                    // to avoid self reference hell
                    if (group.children && group.children.length)
                        iterate(group.children, [...hierarchy, group.id])
                })
            }

            iterate(groups ? [groups] : [], [])

            this.groupsIndex = index
        },
        showCategories() {
            this.$refs['searchOptions']?.deleteQuery()
            this.$refs['searchOptions']?.clearSelectedFilters()
            this.$nextTick(() => {
                this.$el?.querySelector('.page-title')?.scrollIntoView({ behavior: 'smooth' })
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.groups-layout {
    .btn-ctn {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $space-2xl 0;
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

    .button {
        padding: 0;
        width: 100%;
        flex-shrink: 1.5;
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
}

.current-group {
    font-weight: 700;
    font-size: $font-size-l;
    color: $primary-dark;
    display: inline-flex;

    .current-group-skeleton {
        height: $font-size-l;
        border-radius: $border-radius-m;
        margin-right: $font-size-s;
    }
}
</style>

<template>
    <div class="page-section-extra-wide groups-layout page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('common.groups')) }}</h1>

        <div v-if="!groupId" class="search-input-container">
            <SearchOptions :limit="30" ref="searchOptions" section="groups" />
        </div>
        <div class="page-section-wide" v-if="hasSearch">
            <GlobalSearchTab :search="fixedSearch" />
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
import useSearch from '@/composables/useSearch.js'

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

        const { searchFromQuery } = useSearch('groups')

        return {
            organizationsStore,
            searchFromQuery,
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
            groupsIndex: null,
            rootId: null,
        }
    },

    async mounted() {
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
            return !!this.searchFromQuery.search
        },

        fixedSearch() {
            return {
                ...this.searchFromQuery,
                section: 'groups',
            }
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
        height: $layout-size-l;
        border-radius: $border-radius-m;
        margin-right: $layout-size-s;
    }
}
</style>

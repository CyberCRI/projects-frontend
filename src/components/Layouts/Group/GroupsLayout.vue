<template>
    <div class="groups-layout">
        <h1 class="title">{{ $filters.capitalize($t('common.groups')) }}</h1>

        <div class="search-groups-ctn narrow-body">
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
        <div class="current-group-ctn narrow-body">
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
                    :groups="childGroup"
                    :with-title="false"
                    class="list-container"
                >
                    <template #groups="cardListSlotProps">
                        <GroupCard
                            :group="cardListSlotProps.group"
                            :has-sub-groups-link="!!cardListSlotProps.group?.children?.length"
                        />
                    </template>
                </CardList>
            </div>
        </div>
    </div>
</template>
<script>
import { getHierarchyGroups } from '@/api/group.service.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import permissions from '@/mixins/permissions'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import GroupCard from '@/components/peopleKit/GroupCard.vue'
import BreadCrumbs from '@/components/lpikit/BreadCrumbs/BreadCrumbs.vue'
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'

export default {
    name: 'GroupsLayout',

    mixins: [permissions],

    components: {
        SearchInput,
        LpiButton,
        CardList,
        GroupCard,
        BreadCrumbs,
        SkeletonComponent,
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
            searchFilter: {
                search: '',
                section: 'groups',
            },
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
            const groups = await getHierarchyGroups(this.$store.state.organizations.current.code)
            this.rootId = groups.id
            this.buildIndex(groups)
            this.isLoading = false
        },

        updateSearchQuery(searchButton) {
            if (searchButton)
                this.$router.push({
                    name: 'GroupSearch',
                    query: { ...this.searchFilter, section: 'groups' },
                })
            else
                this.$router.push({
                    name: 'GroupSearch',
                    query: { section: 'groups' },
                })
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
    },
}
</script>

<style lang="scss" scoped>
.groups-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: $space-2xl;

    .btn-ctn {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $space-2xl 0;
    }

    .search-groups-ctn {
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

    .title {
        text-align: center;
        font-weight: 700;
        font-size: $font-size-5xl;
        line-height: 50px;
        color: $black;
        width: 100%;
        margin-bottom: $space-m;
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

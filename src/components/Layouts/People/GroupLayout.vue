<template>
    <div v-if="isLoading" class="loader">
        <LpiLoader type="simple" />
    </div>
    <div v-else class="groups-layout">
        <h1 class="title">{{ $filters.capitalize($t('people.title')) }}</h1>

        <div class="main-ctn">
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

            <div v-if="groups.length > 0" class="groups">
                <GroupCard
                    v-for="(group, index) in groups"
                    :group="group"
                    :key="index"
                    @navigated-away="goToGroupPage(group)"
                    class="group"
                />
            </div>

            <div v-else class="groups">
                <p class="empty-text">{{ $t('project.nothing') }}</p>
                <img
                    :src="`${PUBLIC_BINARIES_PREFIX}/empties/emptyBox.svg`"
                    :alt="$t('groups.empty')"
                />
            </div>

            <div class="btn-ctn">
                <LpiButton :label="$t('people.see-people')" @click="updateSearchQuery" />
            </div>
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import GroupCard from '@/components/peopleKit/GroupCard.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'GroupLayout',

    mixins: [imageMixin],

    components: {
        LpiLoader,
        GroupCard,
        SearchInput,
        LpiButton,
    },

    data() {
        return {
            isLoading: true,
            searchFilter: {
                search: '',
                section: 'all',
            },
        }
    },

    async mounted() {
        await this.$store.dispatch(
            'organizations/getPeopleGroups',
            this.$store.getters['organizations/current'].code
        )

        this.isLoading = false
    },

    computed: {
        groups() {
            return this.$store.getters['organizations/peopleGroups']
        },
    },

    methods: {
        updateSearchQuery(searchButton) {
            if (searchButton)
                this.$router.push({
                    path: '/search/groups',
                    query: this.searchFilter,
                })
            else
                this.$router.push({
                    path: '/search/groups',
                })
        },

        goToGroupPage(group) {
            this.$router.push(`/group/${group.id}`)
        },
    },
}
</script>

<style lang="scss" scoped>
.loader {
    margin: auto;
    margin-top: pxToRem(100px);
}

.groups-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: $space-2xl;

    .empty-text {
        font-weight: 400;
        font-size: $font-size-xl;
        line-height: 24px;
        color: $primary-dark;
        margin-bottom: $space-m;
    }

    .btn-ctn {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: $space-2xl 0;
    }

    .main-ctn {
        display: flex;
        flex-direction: column;
        max-width: 1400px;

        .search-input-container {
            display: flex;
            padding: $space-l;
            margin: $space-xl;
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
        font-size: $font-size-3xl;
        line-height: 40px;
        color: $black;
        width: 100%;
        margin-bottom: $space-m;
    }

    .groups {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        margin-bottom: $space-m;

        .group {
            margin: $space-xs;
        }
    }
}
</style>

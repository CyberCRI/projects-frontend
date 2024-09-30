<template>
    <div class="groups-tab">
        <div v-if="isLoading" class="loader">
            <LpiLoader type="simple" />
        </div>
        <div v-else>
            <h4 class="title">
                {{ $t('me.groups') }} <span>({{ groups.length }})</span>
            </h4>
            <div class="list">
                <CardList
                    :desktop-columns-number="6"
                    :is-loading="isLoading"
                    :limit="6"
                    :items="groups"
                >
                    <template #default="groupListSlotProps">
                        <GroupCard
                            v-if="groupListSlotProps.item"
                            :group="groupListSlotProps.item"
                            @navigated-away="$emit('close')"
                        />
                    </template>
                    <template #empty>
                        <div class="empty-ctn">
                            <EmptyCard class="empty-card" :label="noGroupLabel" />
                        </div>
                    </template>
                </CardList>
            </div>
        </div>
    </div>
</template>

<script>
import CardList from '@/components/base/CardList.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import { getGroup } from '@/api/groups.service'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import EmptyCard from '@/components/people/UserProfile/EmptyCard.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'ProfileGroupsTab',

    emits: ['close'],

    components: {
        CardList,
        GroupCard,
        LpiLoader,
        EmptyCard,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        const usersStore = useUsersStore()
        return {
            organizationsStore,
            usersStore,
        }
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            groups: [],
            isLoading: false,
        }
    },

    async mounted() {
        this.isLoading = true
        try {
            // tricky stuff here, some group might not exist anymore
            this.groups = await Promise.allSettled(
                this.user.people_groups.map(async (group) => {
                    try {
                        return await getGroup(
                            this.organizationsStore.current.code,
                            group.id,
                            true // no error toast
                        )
                    } catch (error) {
                        console.error('missing group', group.id)
                        return null
                    }
                })
            ).then(
                (results) =>
                    results
                        .filter((result) => result && result.status == 'fulfilled') // filter out failed requests
                        .map((result) => result.value) // get the value of successful requests
            )
            this.groups = this.groups.filter((group) => !!group)
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false
        }
    },

    computed: {
        isCurrentUser() {
            return this.usersStore.id === this.user.id
        },

        noGroupLabel() {
            return this.isCurrentUser ? this.$t('me.no-group') : this.$t('you.no-group')
        },
    },
}
</script>

<style lang="scss" scoped>
.groups-tab {
    padding: $space-l 0;

    .loader {
        padding: $space-3xl 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .title {
        font-size: $font-size-l;
        font-weight: 700;
        color: $primary-dark;
        margin: $space-l 0;
    }

    .list {
        display: flex;
        gap: $space-l;
        flex-wrap: wrap;

        & > div {
            width: 100%;
        }
    }
}
</style>

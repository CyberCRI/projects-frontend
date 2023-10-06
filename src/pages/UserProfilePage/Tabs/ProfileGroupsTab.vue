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
                    :groups="groups"
                    :with-title="false"
                >
                    <template #groups="groupListSlotProps">
                        <GroupCard
                            v-if="groupListSlotProps.group"
                            :group="groupListSlotProps.group"
                            @navigated-away="goToGroupPage(groupListSlotProps.group)"
                        />
                    </template>
                    <template #empty>
                        <div class="empty-ctn" :class="gridLayout">
                            <EmptyCard class="empty-card" :label="noGroupLabel" />
                        </div>
                    </template>
                </CardList>
            </div>
        </div>
    </div>
</template>

<script>
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import GroupCard from '@/components/peopleKit/GroupCard.vue'
import { getGroup } from '@/api/group.service'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import EmptyCard from '@/components/lpikit/UserProfile/EmptyCard.vue'

export default {
    name: 'ProfileGroupsTab',

    emits: ['close'],

    components: {
        CardList,
        GroupCard,
        LpiLoader,
        EmptyCard,
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
            this.groups = await Promise.all(
                this.user.people_groups.map(async (group) => {
                    try {
                        return await getGroup(
                            this.$store.state.organizations.current.code,
                            group.id
                        )
                    } catch (error) {
                        console.error(error)
                        return null
                    }
                })
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
            return this.$store.getters['users/kid'] === this.user.keycloak_id
        },

        noGroupLabel() {
            return this.isCurrentUser ? this.$t('me.no-group') : this.$t('you.no-group')
        },
    },

    methods: {
        goToGroupPage(group) {
            this.$emit('close')
            this.$router.push(`/group/${group.id}`)
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
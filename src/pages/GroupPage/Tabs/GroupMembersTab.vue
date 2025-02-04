<template>
    <div class="group-members">
        <div class="members">
            <div class="members-header">
                <h2 class="title">
                    {{ $t('group.group-members') }}
                    <span v-if="!isLoading">( {{ membersCount }} )</span>
                </h2>
            </div>
            <MemberListSkeleton :min-gap="90" v-if="isLoading" />
            <DynamicGrid :min-gap="90" v-else class="members-container">
                <GroupMemberItem
                    v-for="member in members"
                    :key="member.id"
                    :user="member"
                    @user-click="openProfileDrawer"
                    class="cursor-pointer shadow-drop"
                />
            </DynamicGrid>
        </div>
        <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>
    <BaseDrawer
        :v-if="profileDrawer.isOpened"
        no-footer
        :is-opened="profileDrawer.isOpened"
        :title="$t('profile.drawer_title')"
        @close="closeProfileDrawer"
        @confirm="closeProfileDrawer"
    >
        <UserProfile
            v-if="profileDrawer.isOpened"
            ref="profile-user"
            :can-edit="false"
            :user-id="profileDrawer.user_id"
            @close="closeProfileDrawer"
        />
    </BaseDrawer>
</template>

<script>
import GroupMemberItem from '@/components/people/GroupMemberItem/GroupMemberItem.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useAPI from '@/composables/useAPI.ts'
import MemberListSkeleton from '@/components/people/MemberListSkeleton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

export default {
    name: 'GroupMembersTab',

    components: {
        GroupMemberItem,
        BaseDrawer,
        UserProfile,
        PaginationButtons,
        MemberListSkeleton,
        DynamicGrid,
    },

    props: {
        membersInitialRequest: {
            type: Object,
            default: () => {},
        },
        isMembersLoading: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            style: {},
            profileDrawer: {
                isOpened: false,
                user_id: null,
            },
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
            membersRequest: this.membersInitialRequest,
            isPaginationLoading: false,
        }
    },

    computed: {
        members() {
            return this.membersRequest.results || []
        },
        membersCount() {
            return this.membersRequest.count || 0
        },
        isLoading() {
            return this.isMembersLoading || this.isPaginationLoading
        },
    },

    methods: {
        async openProfileDrawer(user) {
            this.profileDrawer.user_id = user.id
            this.profileDrawer.isOpened = true
        },

        closeProfileDrawer() {
            this.isEditMode = false
            this.profileDrawer.isOpened = false
            this.profileDrawer.user_id = null
        },

        async onClickPagination(requestedPage) {
            this.isPaginationLoading = true
            this.membersRequest = (await useAPI(requestedPage, {})).data
            this.isPaginationLoading = false
            const el = document.querySelector('.group-members .members-header')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updatePagination(response) {
            this.pagination.currentPage = response.current_page
            this.pagination.total = response.total_page
            this.pagination.previous = response.previous
            this.pagination.next = response.next
            this.pagination.first = response.first
            this.pagination.last = response.last
        },
    },
    watch: {
        membersRequest: {
            handler: function (response) {
                if (response) this.updatePagination(response)
            },
            immediate: true,
        },

        membersInitialRequest: {
            handler: function (membersInitialRequest) {
                if (membersInitialRequest) this.membersRequest = membersInitialRequest
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.group-members {
    .members {
        margin-top: $space-2xl;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: $space-xl;

        &-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            gap: $space-l;

            .title {
                font-weight: 700;
                font-size: $font-size-l;
                color: $primary-dark;
            }
        }

        &-container {
            width: 100%;
            justify-content: space-between;

            .cursor-pointer {
                cursor: pointer;
            }
        }
    }

    .pagination-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: $space-xl;
    }
}
</style>

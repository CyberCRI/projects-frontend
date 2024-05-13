<template>
    <div class="loader-wrapper" v-if="isLoading"><LoaderSimple /></div>
    <div class="user-grid" v-else>
        <UserCardInline
            v-for="item in filteredResults"
            :key="item.id"
            :user="item"
            :selected="item.selected"
            :passive="item.selected"
            :icon="item.selected ? 'Check' : 'Plus'"
            @user-clicked="selectUser(item)"
        />
    </div>
    <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
        <PaginationButtons
            :current="pagination.currentPage"
            :pagination="pagination"
            :total="pagination.total"
            @update-pagination="onClickPagination"
        />
    </div>
</template>
<script>
import UserCardInline from '@/components/lpikit/TeamCard/UserCardInline.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'
export default {
    name: 'TeamResultList',

    components: { UserCardInline, LoaderSimple, PaginationButtons },

    inject: {
        userSelectionSelectUser: {
            from: 'userSelectionSelectUser',
            default: () => {},
        },
    },

    props: {
        initialRequest: {
            type: Object,
            default: () => ({}),
        },
        type: {
            type: String, // "groups" | "users"
            required: true,
        },
        addToCurrentProject: { type: Boolean, default: false },
        team: { type: Array, default: () => [] },
        currentUsers: { type: Array, default: () => [] },
        selectedUsers: { type: Array, default: () => [] },
    },

    data() {
        return {
            isLoading: false,
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
            request: this.initialRequest,
        }
    },

    computed: {
        filteredResults() {
            if (this.type == 'users') {
                return this.results.map((result) => ({
                    ...result,
                    // watch out for current (logged) user (in create project) : it has no id yet !
                    selected:
                        this.selectedUsers.some(
                            (selected) =>
                                this.$filters.isNotGroup(selected) && selected.id === result.id
                        ) ||
                        (this.addToCurrentProject
                            ? this.team.some(
                                  (projectMember) =>
                                      this.$filters.isNotGroup(projectMember) &&
                                      projectMember.id === result.id
                              )
                            : this.currentUsers.some(
                                  (currentUser) =>
                                      this.$filters.isNotGroup(currentUser.user) &&
                                      currentUser.user.id === result.id
                              )),
                }))
            } else {
                // groups
                return this.results.map((result) => ({
                    ...result,
                    selected:
                        this.selectedUsers.some(
                            (selected) =>
                                this.$filters.isGroup(selected) && selected.id === result.id
                        ) ||
                        (this.addToCurrentProject
                            ? this.team.some(
                                  (projectMember) =>
                                      this.$filters.isGroup(projectMember) &&
                                      projectMember.id === result.id
                              )
                            : this.currentUsers.some(
                                  (currentUser) =>
                                      this.$filters.isGroup(currentUser.user) &&
                                      currentUser.user.id === result.id
                              )),
                }))
            }
        },
        results() {
            return this.request.results || []
        },
    },

    watch: {
        initialRequest: {
            handler(initialRequest) {
                if (initialRequest) this.request = initialRequest
            },
            immediate: true,
        },
        request: {
            handler(request) {
                this.updatePagination(request)
            },
            immediate: true,
        },
    },

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.user-ctn')
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
        selectUser(user) {
            user.selected = true
            this.userSelectionSelectUser(user)
        },
    },
}
</script>
<style lang="scss" scoped>
.user-grid {
    display: flex;
    flex-wrap: wrap;
    min-height: pxToRem(300px);
    flex-grow: 1;
    overflow-y: hidden;
    gap: $space-m;
    width: 100%;
    align-content: flex-start;
    justify-self: flex-start;
    padding: $space-s;

    .team-card-small {
        width: calc(50% - $space-m);
    }

    @media screen and (max-width: $max-tablet) {
        .team-card-small {
            width: 100%;
        }
    }
}

.pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
    padding-bottom: $space-xl;
}

.loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}
</style>

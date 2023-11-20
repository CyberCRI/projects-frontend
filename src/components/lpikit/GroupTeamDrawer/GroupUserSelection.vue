<template>
    <section class="group-user-selection">
        <div v-if="selectedUsers.length" class="selected-users-grid">
            <UserCardInline
                v-for="(user, index) in filteredUsers"
                :key="user.keycloak_id"
                :user="user"
                :selected="true"
                icon="Close"
                @user-clicked="removeUser(user, index)"
            />
        </div>
        <div class="show-more" v-if="selectedUsers.length > listLimit">
            <LpiButton
                class="see-more-btn"
                :label="$filters.capitalize($t(seeMoreLabel))"
                size="link"
                @click="isSeeMore = !isSeeMore"
            />
        </div>

        <section class="search-section">
            <SearchInput
                ref="search-input-ctn"
                v-model="queryString"
                :placeholder="$filters.capitalize($t('search.search'))"
                full
                @delete-query="deleteQuery"
            />
            <LpiButton
                v-if="!isLoading && userResults.length"
                class="select-btn"
                :secondary="true"
                :label="$filters.capitalize($t('drawer.select-all'))"
                @click="selectAll"
            />
        </section>

        <div v-if="queryString.length >= 3" class="user-ctn">
            <LoaderSimple v-if="isLoading" />

            <div v-else-if="userResults.length" class="user-grid">
                <UserCardInline
                    v-for="user in userResults"
                    :key="user.keycloak_id"
                    :user="user"
                    :icon="user.selected ? 'Check' : 'Plus'"
                    :selected="user.selected"
                    @user-clicked="selectUser(user)"
                />
            </div>

            <p v-else>{{ $t('team.no-user-message') }}</p>

            <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
                <PaginationButtons
                    :current="pagination.currentPage"
                    :pagination="pagination"
                    :total="pagination.total"
                    @update-pagination="onClickPagination"
                />
            </div>
        </div>
    </section>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import UserCardInline from '@/components/lpikit/TeamCard/UserCardInline.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import { searchPeopleProject } from '@/api/people.service'

export default {
    name: 'GroupUserSelection',

    emits: ['select-user'],

    components: { LpiButton, SearchInput, LoaderSimple, UserCardInline, PaginationButtons },

    mounted() {
        this.$refs['search-input-ctn'].$refs['search-input'].focus()
        this.selectedUsers.push(...this.currentUsers)
    },

    props: {
        currentUsers: {
            type: Array,
            default: () => [],
        },
        listLimit: {
            type: Number,
            default: 8,
        },
    },

    data() {
        return {
            isLoading: true,
            queryString: '',
            selectedUsers: [],
            isSeeMore: true,
            request: {},
        }
    },

    computed: {
        filteredUsers() {
            return this.isSeeMore ? this.selectedUsers.slice(0, this.listLimit) : this.selectedUsers
        },

        seeMoreLabel() {
            return this.isSeeMore ? 'common.see-more' : 'common.see-less'
        },

        userResults() {
            return this.request && this.request.results
                ? this.request.results.map((user) => ({
                      ...user,
                      selected: this.selectedUsers.some(
                          (currentUser) => currentUser.keycloak_id === user.keycloak_id
                      ),
                  }))
                : []
        },
        pagination() {
            if (!this.request) return { total: 0 }
            return {
                currentPage: this.request.current_page,
                total: this.request.total_page,
                previous: this.request.previous,
                next: this.request.next,
                first: this.request.first,
                last: this.request.last,
            }
        },
    },

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.group-user-selection .search-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        searchUser: debounce(async function () {
            this.isLoading = true
            this.request = await searchPeopleProject({
                search: this.queryString,
                org_id: this.$store.getters['organizations/current'].id,
                params: {
                    organizations: [this.$store.getters['organizations/current'].code], // return only users from current org
                },
            })

            this.isLoading = false
        }, 500),

        selectUser(user) {
            this.selectedUsers.push(user)
            user.selected = true
            // user.role = 'members'
            user.is_leader = false
            user.is_manager = false

            this.$emit('select-user', this.selectedUsers)
            // this.updateUserResults()
        },

        removeUser(user, index) {
            user.selected = false
            this.selectedUsers.splice(index, 1)
            this.$emit('select-user', this.selectedUsers)
        },

        deleteQuery() {
            this.queryString = ''
            this.userResults = []
        },
        selectAll() {
            this.userResults.forEach((user) => {
                user.selected = true
            })
            this.selectedUsers.push(
                ...this.userResults.map((user) => ({
                    ...user,
                    is_leader: false,
                    is_manager: false,
                }))
            )
            this.$emit('select-user', this.selectedUsers)
        },
    },

    watch: {
        queryString: function (val) {
            if (val.length >= 3) this.searchUser()
            if (this.queryString === '') this.userResults = []
        },
    },
}
</script>

<style lang="scss" scoped>
section,
.user-ctn {
    display: flex;
    flex-flow: column nowrap;
}

.hide-card {
    display: none;
}

.selected-users-grid {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    overflow-y: hidden;
    gap: $space-m;
    width: 100%;
    align-content: flex-start;
    justify-self: flex-start;
    padding-bottom: $space-m;
}

.user-ctn {
    padding: $space-m;
    border-radius: $border-radius-m;
    min-height: pxToRem(300px);
    align-items: center;
    justify-content: center;
    margin-top: $space-l;

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

        .selected {
            pointer-events: none;
            cursor: default;
        }
    }
}

.search-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-flow: row nowrap;

    .input-ctn {
        flex-grow: 1;
    }

    button {
        margin-left: $space-m;
        width: 30%;
    }
}

.show-more {
    display: flex;
    justify-content: center;
    margin: $space-l 0;
}

.pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
    padding-bottom: $space-xl;
}
</style>

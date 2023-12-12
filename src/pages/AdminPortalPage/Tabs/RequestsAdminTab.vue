<template>
    <div class="requests-admin-tab">
        <p class="intro">
            {{ $t('admin.requests.intro') }}
        </p>

        <LpiLoader v-if="isLoading" class="loader" type="simple" />

        <div v-if="filteredUsers.length && !isLoading" class="user-list">
            <table>
                <tr>
                    <th v-for="(filter, index) in filters" :key="index">
                        <button
                            class="button"
                            @click="sortBy(filter)"
                            :class="{ unsortable: filter.unsortable }"
                        >
                            {{ $filters.capitalize($t(filter.label)) }}
                            <IconImage
                                v-if="!filter.unsortable"
                                :name="filter.order === '-' ? 'MenuDown' : 'MenuUp'"
                                class="icon"
                                :style="{ opacity: filter.isActive ? 1 : 0.33 }"
                            ></IconImage>
                        </button>
                    </th>
                    <th>
                        <input type="checkbox" />
                        {{ $t('admin.requests.table.action') }}
                    </th>
                </tr>
                <tr v-for="(user, index) in filteredUsers" :key="index">
                    <td>{{ $filters.capitalize(user.family_name) }}</td>
                    <td>{{ $filters.capitalize(user.given_name) }}</td>
                    <td>{{ $filters.capitalize(user.email) }}</td>
                    <td>{{ $filters.capitalize(user.job) }}</td>
                    <td class="has-more">
                        <ToolTip
                            arrow
                            class="color-tip"
                            :hover="true"
                            :interactive="false"
                            v-if="user.message?.length > 36"
                        >
                            <span class="more-items">
                                {{ user.message.substring(0, 33) + '...' }}
                            </span>

                            <template #custom-content>
                                <div class="tooltip-div">
                                    {{ user.message }}
                                </div>
                            </template>
                        </ToolTip>
                        <span v-else>{{ user.message }}</span>
                    </td>
                    <td>
                        <LinkButton btn-icon="Close" :label="$t('admin.requests.table.decline')" />
                        <LinkButton btn-icon="Check" :label="$t('admin.requests.table.accept')" />
                    </td>
                </tr>
            </table>
            <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
                <PaginationButtons
                    :current="pagination.currentPage"
                    :pagination="pagination"
                    :total="pagination.total"
                    @update-pagination="onClickPagination"
                />
            </div>
        </div>

        <AccountDrawer
            v-if="isOpenAccountDrawer"
            :is-opened="isOpenAccountDrawer"
            :is-add-mode="!selectedUser"
            :selected-user="selectedUser"
            @close="closeAccountDrawer"
        />
    </div>
</template>

<script>
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import AccountDrawer from '@/components/Layouts/Account/AccountDrawer.vue'

import debounce from 'lodash.debounce'
import IconImage from '@/components/svgs/IconImage.vue'

import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'

import { searchPeopleAdmin } from '@/api/people.service'
import ToolTip from '@/components/lpikit/ToolTip/ToolTip.vue'

export default {
    name: 'RequestsAdminTab',

    components: {
        IconImage,
        LpiLoader,
        SearchInput,
        LpiButton,
        AccountDrawer,
        PaginationButtons,
        LinkButton,
        ToolTip,
    },

    data() {
        return {
            isOpenEditRoleDrawer: false,
            isOpenAccountDrawer: false,
            isLoading: false,
            searchFilter: '',
            selectedUser: null,
            selectedRole: {},
            request: {},
            filters: [
                {
                    label: 'admin.requests.table.last-name',
                    isActive: false,
                    filter: 'family_name',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.requests.table.first-name',
                    isActive: false,
                    filter: 'given_name',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.requests.table.email',
                    isActive: false,
                    filter: 'email',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.requests.table.title',
                    isActive: false,
                    filter: 'job',
                    order: '',
                    unsortable: true,
                },
                {
                    label: 'admin.requests.table.message',
                    isActive: false,
                    filter: 'message',
                    order: '',
                    unsortable: true,
                },
            ],
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        filteredUsers() {
            return this.request && this.request.results
                ? this.request.results.map((u) => ({
                      ...u,
                      people_groups: (u.people_groups || [])
                          .map((g) => g.name)
                          .filter((n) => !!n)
                          .sort(),
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

    mounted() {
        this.searchUser()
    },

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.role-tab .search-input-container')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        searchUser: debounce(async function () {
            this.isLoading = true

            const activeFilter = this.filters.find((filter) => filter.isActive)
            const params = activeFilter
                ? { ordering: activeFilter.order + activeFilter.filter }
                : {}

            this.request = await searchPeopleAdmin({
                search: this.searchFilter,
                org_id: this.organization.id,
                params,
            })

            this.isLoading = false
        }, 500),

        deleteQuery() {
            this.searchFilter = ''
            this.filteredUsers = []
        },

        async sortBy(filter) {
            if (filter.unsortable) return
            if (!filter.isActive) {
                this.filters.forEach((filter) => {
                    filter.isActive = false
                    filter.order = ''
                })
                filter.isActive = !filter.isActive
                filter.order = ''
            } else {
                if (filter.order === '') filter.order = '-'
                else if (filter.order === '-') filter.order = ''
            }
            this.isLoading = true
            this.request = await searchPeopleAdmin({
                search: this.searchFilter,
                org_id: this.organization.id,
                params: {
                    ordering: filter.order + filter.filter,
                },
            })
            this.isLoading = false
        },

        createAccountDrawer(user) {
            if (user) this.selectedUser = user
            this.isOpenAccountDrawer = true
        },

        closeAccountDrawer() {
            this.isOpenAccountDrawer = false
            this.selectedUser = null
            this.searchUser()
        },
    },
}
</script>

<style lang="scss" scoped>
.requests-admin-tab {
    display: flex;
    flex-direction: column;
    padding: $space-xl 0;

    .intro {
        font-size: $font-size-m;
        line-height: 1.5;
        margin: 2.2rem 0;
    }

    .search-input-container {
        display: flex;
        align-items: center;
        flex-basis: 40rem;

        @media screen and (max-width: $max-tablet) {
            flex-basis: auto;
        }

        .search-input {
            margin-right: $space-l;
        }

        .create-account {
            margin-left: $space-m;
        }
    }

    .user-list {
        margin-top: $space-xl;
        width: 100%;
        overflow-x: auto;
    }

    .loader {
        margin: auto;
        padding-top: $space-l;
    }

    .button {
        appearance: none;
        display: flex;
        width: 100%;
        align-items: center;
        background: transparent;
        border: none;
        font-size: $font-size-s;
        line-height: 16px;
        color: $black-1;
        cursor: pointer;

        &.unsotable {
            pointer-events: none;
            cursor: default;
        }

        .icon {
            width: 20px;
            height: 20px;
            fill: $black-1;
        }
    }
}

table {
    border-collapse: unset;
    border: 1px solid #00dba7;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;

    tr:first-child {
        background: $primary-lighter;
    }

    th,
    td {
        padding: 16px 24px;
        text-align: start;
    }

    tr td {
        border-top: 1px solid #99ffe7;
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

.has-more {
    white-space: nowrap;
}

.first-item,
.more-items {
    line-height: 1;
    vertical-align: baseline;
}

.more-items {
    display: inline-block;
    margin-left: 1rem;
    background-color: $primary-dark;
    color: $white;
    font-weight: 700;
    border-radius: 1rem;
    font-size: 0.8rem;
    width: 3rem;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    padding: 0.1rem 0.5rem;
}

.color-tip {
    color: $black !important;
}

.tooltip-div {
    max-width: 20rem;
    white-space: break-spaces;
    padding: $space-m;
    text-align: center;
    line-height: 1.3;
    color: $black;
}
</style>

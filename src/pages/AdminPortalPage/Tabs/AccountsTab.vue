<template>
    <div class="role-tab">
        <div class="search-input-container">
            <SearchInput
                v-model="searchFilter"
                :full="true"
                :placeholder="$t('browse.placeholder')"
                class="search-input"
                @enter="searchUser"
                @delete-query="deleteQuery"
            />
            <LpiButton
                :label="$t('browse.page-title')"
                :secondary="false"
                @click="searchUser"
            ></LpiButton>

            <LpiButton
                :label="$t('account.button')"
                class="create-account"
                :secondary="false"
                @click="createAccountDrawer"
            ></LpiButton>
        </div>

        <LpiLoader v-if="isLoading" class="loader" type="simple" />

        <div v-if="filteredUsers.length && !isLoading" class="user-list">
            <table>
                <tr>
                    <th v-for="(filter, index) in filters" :key="index">
                        <button class="button" @click="sortBy(filter)">
                            {{ $filters.capitalize($t(filter.label)) }}
                            <IconImage
                                :name="filter.order === '-' ? 'MenuDown' : 'MenuUp'"
                                class="icon"
                                :style="{ opacity: filter.isActive ? 1 : 0.33 }"
                            ></IconImage>
                        </button>
                    </th>
                    <th></th>
                </tr>
                <tr v-for="(user, index) in filteredUsers" :key="index">
                    <td>{{ $filters.capitalize(user.given_name) }}</td>
                    <td>{{ $filters.capitalize(user.family_name) }}</td>
                    <td>{{ $filters.capitalize(user.job) }}</td>
                    <td>
                        <BadgeItem
                            v-if="user.current_org_role"
                            :label="
                                $filters.capitalize($t(`groups.roles.${user.current_org_role}`))
                            "
                        />
                    </td>
                    <td>
                        <LpiButton
                            :label="$t('account.edit')"
                            left-icon="Pen"
                            size="link"
                            @click="createAccountDrawer(user)"
                        />
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
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'
import AccountDrawer from '@/components/Layouts/Account/AccountDrawer.vue'

import debounce from 'lodash.debounce'
import IconImage from '@/components/svgs/IconImage.vue'

import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'

import { searchPeopleProject } from '@/api/people.service'

export default {
    name: 'AccountsTab',

    components: {
        IconImage,
        BadgeItem,
        LpiLoader,
        SearchInput,
        LpiButton,
        AccountDrawer,
        PaginationButtons,
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
                    label: 'common.last-name',
                    isActive: true,
                    filter: 'given_name',
                    order: '',
                },
                {
                    label: 'common.first-name',
                    isActive: false,
                    filter: 'family_name',
                    order: '',
                },
                {
                    label: 'common.title',
                    isActive: false,
                    filter: 'job',
                    order: '',
                },
                {
                    label: 'common.role',
                    isActive: false,
                    filter: 'current_org_role',
                    order: '',
                },
            ],
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        filteredUsers() {
            return this.request && this.request.results ? this.request.results : []
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
            const el = document.querySelector('.role-tab .search-input-container')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        searchUser: debounce(async function () {
            this.isLoading = true

            const activeFilter = this.filters.find((filter) => filter.isActive)
            const params = activeFilter
                ? { ordering: activeFilter.order + activeFilter.filter }
                : {}

            this.request = await searchPeopleProject({
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
            this.request = await searchPeopleProject({
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
.role-tab {
    display: flex;
    flex-direction: column;
    padding: $space-xl 0;

    .search-input-container {
        display: flex;
        padding: $space-l;
        background: $primary-lighter;
        align-items: center;
        border-radius: $border-radius-17;

        .search-input {
            margin-right: $space-l;
        }

        .create-account {
            margin-left: $space-m;
        }
    }

    .user-list {
        margin-top: $space-xl;
    }

    .loader {
        margin: auto;
        padding-top: $space-l;
    }

    .button {
        display: flex;
        width: 100%;
        align-items: center;
        background: transparent;
        border: none;
        font-size: $font-size-s;
        line-height: 16px;
        color: $black-1;
        cursor: pointer;

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
</style>

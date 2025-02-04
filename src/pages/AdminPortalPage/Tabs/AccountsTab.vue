<template>
    <div class="role-tab">
        <div class="controls-wrapper">
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
            </div>

            <LinkButton
                :label="$t('account.title-create-add')"
                btn-icon="Plus"
                class="create-account"
                @click="createAccountDrawer(null)"
            ></LinkButton>
        </div>

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
                    <th></th>
                </tr>
                <tr v-for="(user, index) in filteredUsers" :key="index">
                    <td>
                        {{ $filters.capitalize(user.family_name) }}
                    </td>
                    <td>{{ $filters.capitalize(user.given_name) }}</td>
                    <td>{{ $filters.capitalize(user.job) }}</td>
                    <td class="has-more">
                        {{
                            user.current_org_role
                                ? $t(`groups.roles.${user.current_org_role}`)
                                : '-'
                        }}
                    </td>
                    <td class="has-more">
                        <span class="first-item">
                            <template v-if="user.people_groups?.length">
                                <span
                                    :title="user.people_groups[0]"
                                    v-if="user.people_groups[0].length > 28"
                                >
                                    {{ user.people_groups[0].substring(0, 25) + '...' }}
                                </span>
                                <span v-else>{{ user.people_groups[0] }}</span>
                            </template>
                            <template v-else> - </template>
                        </span>
                        <ToolTip arrow class="color-tip" :hover="true" :interactive="false">
                            <span class="more-items" v-if="user.people_groups?.length > 1">
                                + {{ user.people_groups.length - 1 }}
                            </span>

                            <template #custom-content>
                                <div class="tooltip-div">
                                    {{ user.people_groups.slice(1).join(', ') }}
                                </div>
                            </template>
                        </ToolTip>
                    </td>
                    <td>
                        {{ user.created_at ? $d(new Date(user.created_at)) : '-' }}
                    </td>
                    <td>
                        {{
                            user.email_verified
                                ? $t('admin.accounts.table.activation-yes')
                                : $t('admin.accounts.table.activation-no')
                        }}
                    </td>
                    <td>
                        <LinkButton btn-icon="Pen" @click="createAccountDrawer(user)" />
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
            :selected-user="selectedUser"
            @close="closeAccountDrawer"
        />
    </div>
</template>

<script>
import SearchInput from '@/components/base/form/SearchInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import AccountDrawer from '@/components/people/Account/AccountDrawer.vue'

import debounce from 'lodash.debounce'
import IconImage from '@/components/base/media/IconImage.vue'

import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useAPI from '@/composables/useAPI.ts'

import { searchPeopleAdmin } from '@/api/people.service'
import ToolTip from '@/components/base/ToolTip.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
    name: 'AccountsTab',

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
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
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
                    label: 'admin.accounts.table.last-name',
                    isActive: false,
                    filter: 'family_name',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.accounts.table.first-name',
                    isActive: false,
                    filter: 'given_name',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.accounts.table.title',
                    isActive: false,
                    filter: 'job',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.accounts.table.roles',
                    isActive: false,
                    filter: 'current_org_role',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.accounts.table.groups',
                    isActive: false,
                    filter: 'people_groups',
                    order: '',
                    unsortable: true,
                },
                {
                    label: 'admin.accounts.table.inscription',
                    isActive: false,
                    filter: 'created_at',
                    order: '',
                    unsortable: false,
                },
                {
                    label: 'admin.accounts.table.activation',
                    isActive: false,
                    filter: 'email_verified',
                    order: '',
                    unsortable: false,
                },
            ],
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
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
            this.request = (await useAPI(requestedPage, {})).data
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
            params.current_org_role = 'admins,facilitators,users'
            params.limit = 25
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
.role-tab {
    display: flex;
    flex-direction: column;
    padding: $space-xl 0;

    .controls-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;

        @media screen and (max-width: $max-tablet) {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-end;
        }
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
        display: flex;
        width: 100%;
        align-items: center;
        background: transparent;
        border: none;
        font-size: $font-size-s;
        line-height: $line-height-tight;
        color: $almost-black;
        cursor: pointer;

        &.unsotable {
            pointer-events: none;
            cursor: default;
        }

        .icon {
            width: 20px;
            height: 20px;
            fill: $almost-black;
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
    line-height: $line-height-squashed;
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
    color: $black;
}
</style>

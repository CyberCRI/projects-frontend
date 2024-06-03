<template>
    <div class="requests-admin-tab">
        <p class="intro">
            {{ $t('admin.requests.intro') }}
        </p>

        <div class="user-list">
            <table>
                <tr>
                    <th v-for="(filter, index) in filters" :key="index">
                        <span class="button">
                            {{ $filters.capitalize($t(filter.label)) }}
                        </span>
                    </th>
                    <th>
                        <LpiCheckbox
                            v-model="showPendingOnly"
                            :label="$t('admin.requests.table.action')"
                        />
                    </th>
                </tr>
                <tr v-if="isLoading">
                    <td class="pseudo-td" colspan="6">
                        <LpiLoader class="loader" type="simple" />
                    </td>
                </tr>
                <tr v-else-if="!filteredUsers.length">
                    <td class="pseudo-td" colspan="6">
                        {{ $t('admin.requests.table.no-result') }}
                    </td>
                </tr>
                <tr v-else v-for="(user, index) in filteredUsers" :key="index">
                    <td>{{ $filters.capitalize(user.family_name) }}</td>
                    <td>{{ $filters.capitalize(user.given_name) }}</td>
                    <td>
                        <a class="mail-link" :href="`mailto:${user.email}`">{{ user.email }}</a>
                    </td>
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
                        <div v-if="user.status == 'declined'">
                            <span class="status-widget action-status declined-or-accepted">
                                <IconImage name="Close" /> {{ $t('admin.requests.table.declined') }}
                            </span>
                        </div>
                        <div v-else-if="user.status == 'accepted'">
                            <span class="status-widget action-status declined-or-accepted">
                                <IconImage name="Check" /> {{ $t('admin.requests.table.accepted') }}
                            </span>
                        </div>
                        <div class="status-wrapper pending-wrapper" v-else>
                            <button
                                type="button"
                                class="status-widget action-button decline-action"
                                @click="declineRequest(user)"
                            >
                                <IconImage name="Close" /> {{ $t('admin.requests.table.decline') }}
                            </button>
                            <button
                                type="button"
                                class="status-widget action-button accept-action"
                                @click="acceptRequest(user)"
                            >
                                <IconImage name="Check" /> {{ $t('admin.requests.table.accept') }}
                            </button>
                        </div>
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
    </div>
</template>

<script>
import LpiLoader from '@/components/base/loader/LpiLoader.vue'

import debounce from 'lodash.debounce'
import IconImage from '@/components/base/media/IconImage.vue'

import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'

import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

import {
    getAccessRequests,
    acceptAccessRequest,
    declineAccessRequest,
} from '@/api/organizations.service.ts'
import ToolTip from '@/components/base/ToolTip.vue'

export default {
    name: 'RequestsAdminTab',

    components: {
        IconImage,
        LpiLoader,
        PaginationButtons,
        ToolTip,
        LpiCheckbox,
    },

    data() {
        return {
            isLoading: false,
            request: {},
            showPendingOnly: false,
            filters: [
                {
                    label: 'admin.requests.table.last-name',
                    isActive: false,
                    filter: 'family_name',
                    order: '',
                },
                {
                    label: 'admin.requests.table.first-name',
                    isActive: false,
                    filter: 'given_name',
                    order: '',
                },
                {
                    label: 'admin.requests.table.email',
                    isActive: false,
                    filter: 'email',
                    order: '',
                },
                {
                    label: 'admin.requests.table.title',
                    isActive: false,
                    filter: 'job',
                    order: '',
                },
                {
                    label: 'admin.requests.table.message',
                    isActive: false,
                    filter: 'message',
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
        this.searchRequest()
    },

    watch: {
        showPendingOnly: function (neo, old) {
            if (neo != old) {
                this.searchRequest()
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

        searchRequest: debounce(async function () {
            this.isLoading = true

            const activeFilter = this.filters.find((filter) => filter.isActive)
            const params = activeFilter
                ? { ordering: activeFilter.order + activeFilter.filter }
                : {}

            if (this.showPendingOnly) {
                params.status = 'pending'
            }

            this.request = await getAccessRequests(this.organization.code, {
                search: this.searchFilter,
                ...params,
            })

            this.isLoading = false
        }, 500),

        async declineRequest(request) {
            try {
                await declineAccessRequest(this.organization.code, {
                    access_requests: [request.id],
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.requests.decline-success'),
                    type: 'success',
                })
                await this.searchRequest()
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('admin.requests.decline-failed')} (${error})`,
                    type: 'error',
                })
            }
        },

        async acceptRequest(request) {
            try {
                await acceptAccessRequest(this.organization.code, { access_requests: [request.id] })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.requests.accept-success'),
                    type: 'success',
                })
                await this.searchRequest()
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('admin.requests.accept-failed')} (${error})`,
                    type: 'error',
                })
            }
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

    .button {
        appearance: none;
        display: flex;
        width: 100%;
        align-items: center;
        background: transparent;
        border: none;
        font-size: $font-size-s;
        line-height: $line-height-tight;
        color: $almost-black;
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

        label {
            color: $almost-black !important;
            font-weight: 700 !important;
            font-size: $font-size-s !important;
            display: flex;
            align-items: center;
        }
    }

    tr td {
        border-top: 1px solid #99ffe7;
    }
}

.pseudo-td {
    text-align: center;
    padding: 1rem;
}

.loader {
    display: inline-block;
    margin: auto;
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
    color: inherit;
    cursor: pointer;
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

.status-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-m;
    justify-items: start;
}

.status-widget {
    display: inline-flex;
    gap: $space-xs;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: $font-size-s;

    svg {
        $icon-dim: $font-size-m;

        width: $icon-dim;
        height: $icon-dim;
        border-radius: $icon-dim;
        fill: $white;
        padding: 0.1rem;
        box-sizing: border-box;
        display: inline-block;
    }
}

.action-button {
    appearance: none;
    margin: 0;
    padding: 0;
    color: $primary-dark;
    background: none;
    border: 0 none;
    cursor: pointer;
    transition: transform 200ms ease-in-out;
    transform-origin: center bottom;
    transform: scale(1);

    &:hover {
        transform: scale(1.05);
    }

    &.decline-action {
        svg {
            background-color: $salmon;
        }
    }

    &.accept-action {
        svg {
            background-color: $primary;
        }
    }
}

.action-status {
    color: $mid-gray;

    svg {
        background-color: $mid-gray;
    }
}

.declined-or-accepted {
    width: 100%;
}

.mail-link {
    &:hover {
        text-decoration: underline;
    }
}
</style>

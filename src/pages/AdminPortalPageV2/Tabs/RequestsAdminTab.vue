<template>
  <div class="requests-admin-tab">
    <p class="intro">
      {{ $t('admin.requests.intro') }}
    </p>

    <div class="user-list">
      <table>
        <tbody>
          <tr>
            <th v-for="(filter, index) in filters" :key="index">
              <span class="button">
                {{ filter.label }}
              </span>
            </th>
            <th>
              <LpiCheckbox v-model="showPendingOnly" :label="$t('admin.requests.table.action')" />
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
          <tr v-for="(user, index) in filteredUsers" v-else :key="index">
            <td>{{ capitalize(user.family_name) }}</td>
            <td>{{ capitalize(user.given_name) }}</td>
            <td>
              <a class="mail-link" :href="`mailto:${user.email}`">{{ user.email }}</a>
            </td>
            <td>{{ user.job }}</td>
            <td class="has-more">
              <ToolTip
                v-if="user.message?.length > 36"
                arrow
                class="color-tip"
                :hover="true"
                :interactive="false"
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
                  <IconImage name="Close" />
                  {{ $t('admin.requests.table.declined') }}
                </span>
              </div>
              <div v-else-if="user.status == 'accepted'">
                <span class="status-widget action-status declined-or-accepted">
                  <IconImage name="Check" />
                  {{ $t('admin.requests.table.accepted') }}
                </span>
              </div>
              <div v-else class="status-wrapper pending-wrapper">
                <button
                  type="button"
                  class="status-widget action-button decline-action"
                  @click="declineRequest(user)"
                >
                  <IconImage name="Close" />
                  {{ $t('admin.requests.table.decline') }}
                </button>
                <button
                  type="button"
                  class="status-widget action-button accept-action"
                  @click="acceptRequest(user)"
                >
                  <IconImage name="Check" />
                  {{ $t('admin.requests.table.accept') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
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

<script lang="ts">
import {
  acceptAccessRequest,
  declineAccessRequest,
  getAccessRequests,
  clientAPI,
} from 'shared-projects-frontend/apis'
import type { QueryFilterAccessRequests } from 'shared-projects-frontend/apis'

import PaginationButtons from '~/components/base/navigation/PaginationButtons.vue'
import LpiCheckbox from '~/components/base/form/LpiCheckbox.vue'
import LpiLoader from '~/components/base/loader/LpiLoader.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import ToolTip from '~/components/base/ToolTip.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import { capitalize } from '~/functs/string'
import { debounce } from 'es-toolkit'

export default {
  name: 'RequestsAdminTab',

  components: {
    IconImage,
    LpiLoader,
    PaginationButtons,
    ToolTip,
    LpiCheckbox,
  },
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
      capitalize,
    }
  },

  data() {
    return {
      isLoading: false,
      request: {
        count: 0,
        results: [],
      } satisfies PaginationResult as PaginationResult,
      showPendingOnly: false,
    }
  },

  computed: {
    filters() {
      return [
        {
          label: this.$t('admin.requests.table.last-name'),
          isActive: false,
          filter: 'family_name',
          order: '',
        },
        {
          label: this.$t('admin.requests.table.first-name'),
          isActive: false,
          filter: 'given_name',
          order: '',
        },
        {
          label: this.$t('admin.requests.table.email'),
          isActive: false,
          filter: 'email',
          order: '',
        },
        {
          label: this.$t('admin.requests.table.title'),
          isActive: false,
          filter: 'job',
          order: '',
        },
        {
          label: this.$t('admin.requests.table.message'),
          isActive: false,
          filter: 'message',
          order: '',
        },
      ] satisfies {
        label: string
        isActive: boolean
        filter: string
        order: ''
      }[]
    },
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

  watch: {
    showPendingOnly: function (neo, old) {
      if (neo != old) {
        this.searchRequest()
      }
    },
  },

  mounted() {
    this.searchRequest()
  },

  methods: {
    async onClickPagination(requestedPage) {
      this.isLoading = true
      this.request = await clientAPI(requestedPage, {})
      this.isLoading = false
      const el = document.querySelector('.role-tab .search-input-container')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },

    privateSearchRequest: async function () {
      this.isLoading = true

      // TODO add filter tables
      const query: QueryFilterAccessRequests = {}
      if (this.showPendingOnly) {
        query.status = 'pending'
      }

      this.request = await getAccessRequests(this.organization.code, {
        query,
      })

      this.isLoading = false
    },

    searchRequest: debounce(function (this: any) {
      return this.privateSearchRequest()
    }, 500),

    async declineRequest(request) {
      try {
        await declineAccessRequest(this.organization.code, {
          access_requests: [request.id],
        })
        this.toaster.pushSuccess(this.$t('admin.requests.decline-success'))

        await this.searchRequest()
      } catch (error) {
        this.toaster.pushError(`${this.$t('admin.requests.decline-failed')} (${error})`)
      }
    },

    async acceptRequest(request) {
      try {
        await acceptAccessRequest(this.organization.code, {
          access_requests: [request.id],
        })
        this.toaster.pushSuccess(this.$t('admin.requests.accept-success'))

        await this.searchRequest()
      } catch (error) {
        this.toaster.pushError(`${this.$t('admin.requests.accept-failed')} (${error})`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.requests-admin-tab {
  display: flex;
  flex-direction: column;

  .intro {
    font-size: variables.$font-size-m;
    margin: 2.2rem 0;
  }

  .search-input-container {
    display: flex;
    align-items: center;
    flex-basis: 40rem;

    @media screen and (max-width: variables.$max-tablet) {
      flex-basis: auto;
    }

    .search-input {
      margin-right: variables.$space-l;
    }

    .create-account {
      margin-left: variables.$space-m;
    }
  }

  .user-list {
    margin-top: variables.$space-xl;
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
    font-size: variables.$font-size-s;
    line-height: variables.$line-height-tight;
    color: variables.$almost-black;
  }
}

table {
  border-collapse: unset;
  border: 1px solid #00dba7;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;

  tr:first-child {
    background: variables.$primary-lighter;
  }

  th,
  td {
    padding: 16px 24px;
    text-align: start;

    label {
      color: variables.$almost-black !important;
      font-weight: 700 !important;
      font-size: variables.$font-size-s !important;
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
  padding-top: variables.$space-xl;
  padding-bottom: variables.$space-xl;
}

.has-more {
  white-space: nowrap;
}

.first-item,
.more-items {
  line-height: variables.$line-height-squashed;
  vertical-align: baseline;
}

.more-items {
  display: inline-block;
  color: inherit;
  cursor: pointer;
}

.color-tip {
  color: variables.$black !important;
}

.tooltip-div {
  max-width: 20rem;
  white-space: break-spaces;
  padding: variables.$space-m;
  text-align: center;
  color: variables.$black;
}

.status-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: variables.$space-m;
  justify-items: start;
}

.status-widget {
  display: inline-flex;
  gap: variables.$space-xs;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: variables.$font-size-s;

  svg {
    $icon-dim: variables.$layout-size-m;

    width: $icon-dim;
    height: $icon-dim;
    border-radius: $icon-dim;
    fill: variables.$white;
    padding: 0.1rem;
    box-sizing: border-box;
    display: inline-block;
  }
}

.action-button {
  appearance: none;
  margin: 0;
  padding: 0;
  color: variables.$primary-dark;
  background: none;
  border: 0 none;
  cursor: pointer;
  transition: transform 200ms ease-in-out;
  transform-origin: center bottom;
  transform: translateZ(0) scale(1);

  &:hover {
    transform: translateZ(0) scale(1.05);
  }

  &.decline-action {
    svg {
      background-color: variables.$salmon;
    }
  }

  &.accept-action {
    svg {
      background-color: variables.$primary;
    }
  }
}

.action-status {
  color: variables.$mid-gray;

  svg {
    background-color: variables.$mid-gray;
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

<template>
  <div class="role-tab">
    <FetchLoader :status="status" :with-data="!!data" skeleton>
      <div class="create-wrapper">
        <LinkButton
          :label="$t('account.title-create-add')"
          btn-icon="Plus"
          class="create-account"
          @click="openModal()"
        />
      </div>
      <div class="controls-wrapper">
        <div class="search-input-container">
          <SearchInput
            v-model="search"
            :full="true"
            :placeholder="$t('browse.placeholder')"
            class="search-input"
            @enter="onSearch"
            @delete-query="onClearSearch"
          />
          <LpiButton :label="$t('browse.page-title')" :secondary="false" @click="onSearch" />
        </div>

        <div class="num-results-label">
          <label>{{ $t('browse.result-per-page') }}</label>
          <LpiSelect
            :model-value="pagination.limit.value"
            class="small"
            :options="LIMIT_OPTIONS"
            @update:model-value="(l) => pagination.setLimit(l)"
          />
        </div>
      </div>

      <div class="user-list">
        <table>
          <tbody>
            <tr>
              <th />
              <th v-for="(row, index) in rows" :key="index">
                <button
                  class="button skeletons-text"
                  :class="{ unsortable: row.unsortable }"
                  @click="orderBy(row)"
                >
                  {{ row.label }}
                  <IconImage
                    v-if="!row.unsortable"
                    :name="query.ordering !== row.filter ? 'MenuDown' : 'MenuUp'"
                    class="icon"
                    :style="{ opacity: row.isActive ? 1 : 0.33 }"
                  />
                </button>
              </th>
              <th />
            </tr>
            <template v-for="(user, index) in data" :key="index">
              <tr class="user-row" :class="{ 'is-opened': openedLine.has(user.id) }">
                <td>
                  <button
                    class="skeletons-text"
                    @click="
                      openedLine.has(user.id) ? openedLine.delete(user.id) : openedLine.add(user.id)
                    "
                  >
                    <IconImage
                      :name="openedLine.has(user.id) ? 'MenuUp' : 'MenuDown'"
                      class="toggle-user-icon"
                    />
                  </button>
                </td>
                <td>
                  <div class="user-mail skeletons-text">
                    {{ user.email }}
                  </div>
                </td>
                <td>
                  <span class="skeletons-text">
                    {{ capitalize(user.family_name) }}
                    {{ capitalize(user.given_name) }}
                  </span>
                </td>
                <td>
                  <span class="skeletons-text">
                    {{ user.created_at ? $d(new Date(user.created_at)) : '-' }}
                  </span>
                </td>
                <td>
                  <IconImage
                    :name="user.email_verified ? 'Check' : 'Close'"
                    class="skeletons-background email"
                    :class="{
                      verified: user.email_verified,
                    }"
                  />
                </td>
                <td>
                  <LinkButton
                    class="skeletons-text"
                    btn-icon="Pen"
                    @click="createAccountDrawer(user)"
                  />
                </td>
              </tr>
              <tr v-if="openedLine.has(user.id)" class="user-details-row">
                <td />
                <td :colspan="rows.length">
                  <div class="user-details-wrapper">
                    <dl class="user-details">
                      <dt>{{ $t('admin.accounts.table.title') }}</dt>
                      <dd>{{ user.job }}</dd>
                    </dl>
                    <dl class="user-details">
                      <dt>{{ $t('admin.accounts.table.roles') }}</dt>
                      <dd v-if="user.current_org_role">
                        {{ $t(`groups.roles.${user.current_org_role}`) }}
                      </dd>
                      <dd v-else>-</dd>
                    </dl>
                    <dl class="user-details">
                      <dt>{{ $t('admin.accounts.table.groups') }}</dt>
                      <dd>
                        <ul>
                          <li v-for="group in user.people_groups || []" :key="group.id">
                            {{ group.name }}
                          </li>
                        </ul>
                      </dd>
                    </dl>
                  </div>
                </td>
                <td />
              </tr>
            </template>
            <!-- when no results found -->
            <template v-if="data.length === 0">
              <tr>
                <td colspan="5">
                  <EmptyLabel />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <PaginationButtonsV2 :pagination="pagination" />
      </div>

      <AccountDrawer
        v-if="stateModal"
        :is-opened="stateModal"
        :selected-user="selectedUser"
        @close="closeAccountDrawer"
      />
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import { searchPeopleAdmin } from '@/api/v2/people.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { capitalize } from '@/functs/string'
import { Ordering } from '@/interfaces/query'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { peopleSkeleton } from '@/skeletons/people.skeletons'
import useOrganizationsStore from '@/stores/useOrganizations'

const organizationsStore = useOrganizationsStore()

const { t } = useNuxtI18n()

const openedLine = ref(new Set())

const selectedUser = ref(null)
const { stateModal, openModal, closeModal } = useModal()

const rows = computed(() => [
  {
    label: t('form.email'),
    isActive: false,
    filter: 'email',
    order: '',
    unsortable: true,
  },
  {
    label: t('admin.accounts.table.last-name'),
    isActive: false,
    filter: 'family_name',
    order: '',
    unsortable: false,
  },
  {
    label: t('admin.accounts.table.inscription'),
    isActive: false,
    filter: 'created_at',
    order: '',
    unsortable: false,
  },
  {
    label: t('admin.accounts.table.activation'),
    isActive: false,
    filter: 'email_verified',
    order: '',
    unsortable: false,
  },
])

const LIMIT_OPTIONS = [
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]
const LIMIT = LIMIT_OPTIONS[0].value

type OrderAdmin = 'family_name' | 'created_at' | 'email_verified'
type QuerySearchAdmin = {
  current_org_role: string
  search: string
  ordering: Ordering<OrderAdmin>
}

const search = ref('')
const { query, setQuery } = useQuery<QuerySearchAdmin>({
  current_org_role: 'admins,facilitators,users,viewers',
  ordering: '-created_at',
  search: search.value,
})

// TODO change to organizationCode
// TODO add translate for user/group
const organizationId = computed(() => organizationsStore.current.id)
const { status, data, refresh, pagination } = searchPeopleAdmin(organizationId, {
  query,
  default: () => factoriesSkeleton(peopleSkeleton, LIMIT),
  paginationConfig: {
    limit: LIMIT,
  },
})

const orderBy = (row) => {
  if (row.unsortable) return

  const nameFilter = row.filter as OrderAdmin

  // if ordering is already set , revese it with '-' prefix
  if (query.ordering === nameFilter) {
    setQuery('ordering', `-${nameFilter}`)
  } else {
    setQuery('ordering', nameFilter)
  }
}

const onSearch = () => setQuery('search', search.value)
const onClearSearch = () => {
  search.value = ''
  setQuery('search', '')
}

const createAccountDrawer = (user) => {
  selectedUser.value = user
  openModal()
}

const closeAccountDrawer = () => {
  selectedUser.value = null
  closeModal()
  refresh()
}
</script>

<style lang="scss" scoped>
.role-tab {
  display: flex;
  flex-direction: column;

  .controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;

    @media screen and (max-width: $max-tablet) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }

  .create-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: $space-l;
  }

  .search-input-container {
    display: flex;
    align-items: center;
    flex-basis: 40rem;
    gap: $space-l;

    @media screen and (max-width: $max-tablet) {
      flex-basis: 100%;
      flex-grow: 1;
    }
  }

  .user-list {
    margin-top: $space-xl;
    width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

.user-mail {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-user-icon {
  width: 28px;
  height: 28px;
  fill: $almost-black;
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
    padding: 12px;
    text-align: start;
  }

  tr:not(.user-details-row) {
    td {
      border-top: 1px solid #99ffe7;
    }

    td:last-child,
    td:first-child {
      padding: 12px 8px;
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

.num-results-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;

  label {
    flex-shrink: 0;
    font-weight: 500;
  }
}

.user-details-wrapper {
  display: flex;
  gap: $space-m;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}

.user-details {
  dt {
    color: $primary-dark;
  }

  ul {
    list-style-type: square;
    list-style-position: inside;
  }
}

.email {
  margin: auto;
  width: 2rem;
  height: 2rem;

  &:not(.verified) {
    fill: var(--red);
  }

  &.verified {
    fill: var(--primary-dark);
  }
}
</style>

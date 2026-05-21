<script setup lang="ts">
import CardInlineUser from '~/components/drawer/User/CardInlineUser.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import { searchUserSkeleton } from '~/skeletons/search.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import type { TranslatedUserModel } from '~/models/user.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchUser } from '~/api/v2/search.service'

const search = ref('')
const LIMIT = 30

const props = withDefaults(
  defineProps<{
    query?: QueryFilterSearch
  }>(),
  {
    query: () => ({}),
  }
)

const organizationCode = useOrganizationCode()
const {
  status,
  data: searchUsers,
  pagination,
} = getSearchUser(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchUserSkeleton, LIMIT, LIMIT),
})

const selectedUser = defineModel<TranslatedUserModel[]>({ default: [] })
const selectedUserId = computed(() => selectedUser.value.map((user) => user.id))
const toggleUser = (user: TranslatedUserModel) => {
  if (selectedUserId.value.includes(user.id)) {
    selectedUser.value = selectedUser.value.filter((item) => item.id !== user.id)
  } else {
    selectedUser.value.push(user)
  }
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-model="search"
      :count-result="searchUsers.length"
      :count-selected="selectedUser.length"
    >
      <template #selected>
        <div class="list-flow-container selected-user my2">
          <TransitionGroup name="fade-member">
            <CardInlineUser
              v-for="user in selectedUser"
              :key="user.id"
              :user="user"
              minimal
              selected
              icon="Close"
              @click="toggleUser(user)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template #results>
        <div class="list-flow-container">
          <CardInlineUser
            v-for="item in searchUsers"
            :key="item.id"
            :user="item.user"
            :selected="selectedUserId.includes(item.user.id)"
            :icon="selectedUserId.includes(item.user.id) ? 'Check' : 'Plus'"
            @click="toggleUser(item.user)"
          />
        </div>
        <PaginationButtonsV2 class="m4" :pagination="pagination" />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>

<style lang="scss" scoped>
.selected-user {
  justify-content: flex-start;
  gap: 0.5rem;
}

.fade-member-move,
.fade-member-enter-active,
.fade-member-leave-active {
  transition: all 0.3s ease;
}

.fade-member-enter-from,
.fade-member-leave-to {
  opacity: 0;
}
</style>

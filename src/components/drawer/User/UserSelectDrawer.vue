<script setup lang="ts">
import type { DrawerSearchProps } from '~/components/drawer/BaseDrawerSearch.vue'
import CardInlineUser from '~/components/drawer/User/CardInlineUser.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import { searchUserSkeleton } from '~/skeletons/search.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import type { TranslatedUserModel } from '~/models/user.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchUser } from '~/api/v2/search.service'

const props = withDefaults(
  defineProps<{
    selectedUsers?: TranslatedUserModel[]
    query?: QueryFilterSearch
    title?: string
    isOpened?: boolean
  }>(),
  {
    selectedUsers: () => [],
    query: () => ({}),
    title: null,
    isOpened: false,
  }
)
const emit = defineEmits<{
  close: []
  submit: [TranslatedUserModel[]]
}>()

const attrs = useAttrs() as DrawerSearchProps<TranslatedUserModel>

const search = ref('')
const LIMIT = 30

const organizationCode = useOrganizationCode()
const {
  status,
  data: searchUsers,
  pagination,
  refresh,
} = getSearchUser(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchUserSkeleton, LIMIT, LIMIT),
  immediate: false,
})

// reset and refresh when opened
watchEffect(() => {
  if (props.isOpened) {
    search.value = ''
    refresh()
  }
})

const results = computed(() => searchUsers.value.map((searchObj) => searchObj.user))
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-bind="attrs"
      v-model:search="search"
      :is-opened="isOpened"
      :title="title || $t('drawer.user.add', attrs.maxSelected)"
      :pagination="pagination"
      :results="results"
      :selected="selectedUsers"
      @close="emit('close')"
      @confirm="emit('submit', $event)"
    >
      <template #select-item="{ item, onClick }">
        <CardInlineUser
          :key="item.id"
          :user="item"
          minimal
          selected
          icon="Close"
          @click="onClick"
        />
      </template>
      <template #search-item="{ item, onClick, selected }">
        <CardInlineUser
          :key="item.id"
          :user="item"
          :selected="selected"
          :icon="selected ? 'Check' : 'Plus'"
          @click="onClick"
        />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>

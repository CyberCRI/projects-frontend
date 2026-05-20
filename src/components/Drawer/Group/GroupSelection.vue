<script setup lang="ts">
import CardInlineGroup from '~/components/Drawer/Group/CardInlineGroup.vue'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import BaseDrawerSearch from '~/components/Drawer/BaseDrawerSearch.vue'
import { searchGroupSkeleton } from '~/skeletons/search.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchGroup } from '~/api/v2/search.service'

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
  data: searchGroups,
  pagination,
} = getSearchGroup(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
    modules: 'none',
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchGroupSkeleton, LIMIT, LIMIT),
})

const selectedGroups = defineModel<TranslatedPeopleGroupModel[]>({ default: [] })
const selectedGroupsId = computed(() => selectedGroups.value.map((user) => user.id))
const toggleUser = (user: TranslatedPeopleGroupModel) => {
  if (selectedGroupsId.value.includes(user.id)) {
    selectedGroups.value = selectedGroups.value.filter((item) => item.id !== user.id)
  } else {
    selectedGroups.value.push(user)
  }
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-model="search"
      :count-result="searchGroups.length"
      :count-selected="selectedGroups.length"
    >
      <template #selected>
        <div class="list-flow-container selected-user my2">
          <TransitionGroup name="fade-member">
            <CardInlineGroup
              v-for="group in selectedGroups"
              :key="group.id"
              :group="group"
              minimal
              selected
              icon="Check"
              @click="toggleUser(group)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template #results>
        <div class="list-flow-container">
          <CardInlineGroup
            v-for="item in searchGroups"
            :key="item.id"
            :group="item.people_group"
            :selected="selectedGroupsId.includes(item.people_group.id)"
            :icon="selectedGroupsId.includes(item.people_group.id) ? 'Check' : 'Plus'"
            @click="toggleUser(item.people_group)"
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

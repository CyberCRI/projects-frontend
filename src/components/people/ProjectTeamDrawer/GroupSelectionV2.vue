<script setup lang="ts">
import BaseDrawerSearch from '~/components/people/Drawer/BaseDrawerSearch.vue'
import CardInline from '~/components/people/ProjectTeamDrawer/CardInline.vue'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
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
            <CardInline
              v-for="group in selectedGroups"
              :key="group.id"
              :label="group.$t.name"
              :image="group.header_image"
              :default-picture="DEFAULT_GROUP_PATATOID"
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
          <CardInline
            v-for="item in searchGroups"
            :key="item.id"
            :label="item.people_group.$t.name"
            :image="item.people_group.header_image"
            :description="item.people_group.short_description"
            :default-picture="DEFAULT_GROUP_PATATOID"
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

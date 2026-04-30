<template>
  <SearchResults
    :search="search"
    :mode="search.section || 'global'"
    :freeze-search="freezeSearch"
    @pagination-changed="onPaginationChange"
  >
    <template #default="SearchResultsSlotProps">
      <CardList
        :is-loading="SearchResultsSlotProps.isLoading"
        :limit="SearchResultsSlotProps.limit"
        :items="SearchResultsSlotProps.items"
        switchable-display
      >
        <template #default="projectListSlotProps">
          <ProjectCard
            v-if="projectListSlotProps.item.type == 'project'"
            :project="projectListSlotProps.item.project"
            :mode="projectListSlotProps.mode"
          />
          <GroupCard
            v-if="projectListSlotProps.item.type == 'people_group'"
            :group="projectListSlotProps.item.people_group"
            :mode="projectListSlotProps.mode"
          />
          <UserCard
            v-if="projectListSlotProps.item.type == 'user'"
            :user="projectListSlotProps.item.user"
            :mode="projectListSlotProps.mode"
            :to-link="{
              name: 'ProfileOtherUser',
              params: {
                userId: projectListSlotProps.item.user.slug || projectListSlotProps.item.user.id,
              },
            }"
          />
        </template>
      </CardList>
    </template>
  </SearchResults>
</template>

<script setup lang="ts">
import SearchResults from '~/components/project/SearchResults.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'
import GroupCard from '~/components/group/GroupCard.vue'
import UserCard from '~/components/people/UserCard.vue'
import CardList from '~/components/base/CardList.vue'

withDefaults(
  defineProps<{
    search?: any
    freezeSearch?: boolean
  }>(),
  {
    search: null,
    freezeSearch: false,
  }
)

const route = useRoute()
const router = useRouter()

const onPaginationChange = (pagination) => {
  if (
    route.query.page === pagination.currentPage ||
    (!route.query.page && pagination.currentPage === 1)
  )
    return
  router.push({
    path: route.path,
    query: { ...route.query, page: pagination.currentPage },
  })
}
</script>

<style lang="scss" scoped>
.list-container {
  margin-top: $space-l;
}
</style>

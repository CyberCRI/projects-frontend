<template>
  <SearchResults class="list-container" :query="query" :search="search" :mode="mode">
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
              name: 'ProfileUser',
              params: {
                userIdOrSlug:
                  projectListSlotProps.item.user.slug || projectListSlotProps.item.user.id,
              },
            }"
          />
        </template>
      </CardList>
    </template>
  </SearchResults>
</template>

<script setup lang="ts">
import type { AllSearchSections } from '~/components/search/Filters/useSectionFilters'
import type { QueryFilterSearch } from 'shared-projects-frontend/models'
import SearchResults from '~/components/project/SearchResults.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'
import GroupCard from '~/components/group/GroupCard.vue'
import UserCard from '~/components/people/UserCard.vue'
import CardList from '~/components/base/CardList.vue'

withDefaults(
  defineProps<{
    query?: QueryFilterSearch
    search?: string
    mode?: AllSearchSections
  }>(),
  {
    query: () => ({}),
    search: '',
    mode: 'all',
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.list-container {
  margin: variables.$space-l;
}
</style>

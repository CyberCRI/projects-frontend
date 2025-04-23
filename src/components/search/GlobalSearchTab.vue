<template>
  <SearchResults
    :search="search"
    :mode="search.section || 'global'"
    @pagination-changed="onPaginationChange"
  >
    <template #default="SearchResultsSlotProps">
      <CardList
        :desktop-columns-number="6"
        :is-loading="SearchResultsSlotProps.isLoading"
        :limit="SearchResultsSlotProps.limit"
        :items="SearchResultsSlotProps.items"
        class="list-container"
      >
        <template #default="projectListSlotProps">
          <ProjectCard
            v-if="projectListSlotProps.item.type == 'project'"
            :project="projectListSlotProps.item.project"
          />
          <GroupCard
            v-if="projectListSlotProps.item.type == 'people_group'"
            :group="projectListSlotProps.item.people_group"
          />
          <UserCard
            v-if="projectListSlotProps.item.type == 'user'"
            :user="projectListSlotProps.item.user"
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

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/base/CardList.vue'
import SearchResults from '@/components/project/SearchResults.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import UserCard from '@/components/people/UserCard.vue'

export default {
  name: 'GlobalSearchTab',

  components: {
    UserCard,
    GroupCard,
    ProjectCard,
    CardList,
    SearchResults,
  },

  props: {
    search: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    onPaginationChange(pagination) {
      if (
        this.$route.query.page === pagination.currentPage ||
        (!this.$route.query.page && pagination.currentPage === 1)
      )
        return
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, page: pagination.currentPage },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.list-container {
  margin-top: $space-l;
}
</style>

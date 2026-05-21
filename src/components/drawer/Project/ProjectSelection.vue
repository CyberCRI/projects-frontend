<script setup lang="ts">
import CardInlineProject from '~/components/drawer/Project/CardInlineProject.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import { searchProjectSkeleton } from '~/skeletons/search.skeletons'
import type { TranslatedProject } from '~/models/project.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchProjects } from '~/api/v2/search.service'

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
  data: searchProjects,
  pagination,
} = getSearchProjects(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
    modules: 'none',
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchProjectSkeleton, LIMIT, LIMIT),
})

const selectedProjects = defineModel<TranslatedProject[]>({ default: [] })
const selectedProjectsId = computed(() => selectedProjects.value.map((user) => user.id))
const toggleUser = (user: TranslatedProject) => {
  if (selectedProjectsId.value.includes(user.id)) {
    selectedProjects.value = selectedProjects.value.filter((item) => item.id !== user.id)
  } else {
    selectedProjects.value.push(user)
  }
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-model="search"
      :count-result="searchProjects.length"
      :count-selected="selectedProjects.length"
    >
      <template #selected>
        <div class="list-flow-container selected-user my2">
          <TransitionGroup name="fade-member">
            <CardInlineProject
              v-for="project in selectedProjects"
              :key="project.id"
              :project="project"
              minimal
              selected
              icon="Close"
              @click="toggleUser(project)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template #results>
        <div class="list-flow-container">
          <CardInlineProject
            v-for="item in searchProjects"
            :key="item.id"
            :project="item.project"
            :selected="selectedProjectsId.includes(item.project.id)"
            :icon="selectedProjectsId.includes(item.project.id) ? 'Check' : 'Plus'"
            @click="toggleUser(item.project)"
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

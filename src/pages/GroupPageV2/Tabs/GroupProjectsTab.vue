<template>
  <div class="group-projects">
    <div class="projects">
      <div class="projects-header">
        <h2 class="title">
          {{ $t('group.group-projects') }}
          <span v-if="!isLoading">( {{ projectsCount }} )</span>
        </h2>
      </div>
      <div class="projects-container">
        <CardList :is-loading="isLoading" :items="projects">
          <template #default="projectListSlotProps">
            <ProjectCard :project="projectListSlotProps.item" />
          </template>
        </CardList>
      </div>
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

<script>
import CardList from '@/components/base/CardList.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useAPI from '@/composables/useAPI.ts'

export default {
  name: 'GroupProjectsTab',

  components: {
    CardList,
    ProjectCard,
    PaginationButtons,
  },

  props: {
    projectsInitialRequest: {
      type: Object,
      default: () => ({}),
    },

    isProjectsLoading: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const style = ref({})
    const pagination = ref({
      currentPage: 1,
      total: 1,
      previous: undefined,
      next: undefined,
      first: undefined,
      last: undefined,
    })
    const projectsRequest = ref(props.projectsInitialRequest)
    const isPaginationLoading = ref(false)
    const { translateProjects } = useAutoTranslate()
    const rawProjects = computed(() => projectsRequest.value?.results || [])
    const projects = translateProjects(rawProjects)
    const projectsCount = computed(() => projectsRequest.value?.count || 0)
    const isLoading = computed(() => props.isProjectsLoading || isPaginationLoading.value)

    return {
      style,
      pagination,
      projectsRequest,
      isPaginationLoading,
      projects,
      projectsCount,
      isLoading,
    }
  },

  watch: {
    projectsRequest: {
      handler: function (response) {
        if (response) this.updatePagination(response)
      },
      immediate: true,
    },

    projectsInitialRequest: {
      handler: function (projectsInitialRequest) {
        if (projectsInitialRequest) this.projectsRequest = projectsInitialRequest
      },
      immediate: true,
    },
  },
  methods: {
    async onClickPagination(requestedPage) {
      this.isPaginationLoading = true
      this.projectsRequest = await useAPI(requestedPage, {})
      this.isPaginationLoading = false
      const el = document.querySelector('.group-projects .projects-header')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },

    updatePagination(response) {
      this.pagination.currentPage = response.current_page
      this.pagination.total = response.total_page
      this.pagination.previous = response.previous
      this.pagination.next = response.next
      this.pagination.first = response.first
      this.pagination.last = response.last
    },
  },
}
</script>

<style lang="scss" scoped>
.group-projects {
  .projects {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: $space-l;

      .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $primary-dark;
      }
    }

    &-container {
      width: 100%;
    }
  }

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
  }
}
</style>

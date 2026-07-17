<template>
  <div class="home-header-connected">
    <div class="page-section-medium title-container">
      <h1 class="main-title">
        {{ organization.dashboard_title }}
      </h1>
    </div>
    <!-- TODO keepin for testing purpose to remove when all is set -->
    <!--div class="debug" style="background-color: rgb(255 0 0 / 100%); text-align: center">
            <label>
                projects <input v-model="summaryMaxProjects" type="number" min="0" max="3"
            /></label>
            <label>
                events <input v-model="summaryMaxEvents" type="number" min="0" max="3"
            /></label>

            <label>
                instructions <input v-model="summaryMaxInstructions" type="number" min="0" max="1"
            /></label>
        </div-->
    <div v-if="!isLoading" class="summary-cards" data-test="home-user-header">
      <div v-if="!isEmptyDashboard" class="summary-container page-section-wide">
        <ProjectSummaryBlock
          v-if="canCreateProject"
          :projects="displayableProjects"
          :inlined="numberOfSummaryBlock < 2"
        />

        <EventSummaryBlock
          v-if="displayableEvents.length"
          :events="displayableEvents"
          :inlined="numberOfSummaryBlock < 2"
          @reload="loadEvents"
        />
        <InstructionSummaryBlock
          v-if="displayableInstructions.length"
          :instructions="displayableInstructions"
          :inlined="numberOfSummaryBlock < 2"
          @reload-instructions="loadInstructions"
        />
      </div>
      <div v-if="isEmptyDashboard" class="empty-dashboard">
        <LpiButton
          :label="$t('home.create-project')"
          secondary
          btn-icon="Plus"
          class="white-bg"
          data-test="empty-dashboard-create-project"
          @click="$router.push({ name: 'createProject' })"
        />
      </div>
    </div>
    <LpiLoader v-else class="loading" type="simple" />
  </div>
</template>
<script lang="ts">
import { getAllInstructions, searchProjects, getAllEvents } from 'shared-projects-frontend/apis'

import InstructionSummaryBlock from '~/components/home/SummaryCards/InstructionSummaryBlock.vue'
import ProjectSummaryBlock from '~/components/home/SummaryCards/ProjectSummaryBlock.vue'
import EventSummaryBlock from '~/components/home/SummaryCards/EventSummaryBlock.vue'
import LpiLoader from '~/components/base/loader/LpiLoader.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useUsersStore from '~/stores/useUsers'

import type {
  QueryFilterEvent,
  QueryFilterInstruction,
  QueryFilterSearch,
} from 'shared-projects-frontend/models'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { nowDate } from '~/functs/date'

export default {
  name: 'HomeHeaderConnected',

  components: {
    ProjectSummaryBlock,
    EventSummaryBlock,
    InstructionSummaryBlock,
    LpiLoader,
    LpiButton,
  },
  setup() {
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const { translateProjects, translateEvents, translateInstructions } = useAutoTranslate()

    const originalEvents = ref([])
    const originalProject = ref([])
    const originalInstructions = ref([])

    const events = translateEvents(originalEvents)
    const projects = translateProjects(originalProject)
    const instructions = translateInstructions(originalInstructions)

    const summaryMaxEvents = ref(3)
    const summaryMaxProjects = ref(3)
    const summaryMaxInstructions = ref(1)
    const isLoading = ref(true)

    const { canCreateProject } = usePermissionProject(null)
    return {
      organizationsStore,
      usersStore,
      originalProject,
      originalEvents,
      originalInstructions,
      projects,
      events,
      instructions,
      summaryMaxEvents,
      summaryMaxProjects,
      summaryMaxInstructions,
      isLoading,
      canCreateProject,
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },

    displayableEvents() {
      return this.events?.slice(0, this.summaryMaxEvents) || []
    },

    displayableInstructions() {
      return this.instructions?.slice(0, this.summaryMaxInstructions)
    },

    displayableProjects() {
      return this.projects?.slice(0, this.summaryMaxProjects)
    },

    loggedIn() {
      return this.usersStore.isConnected
    },

    numberOfSummaryBlock() {
      let res = 0
      if (this.loggedIn) res++ // my projects block always visible (at leat create project button)
      if (this.displayableEvents.length > 0) res++
      if (this.displayableInstructions.length > 0) res++

      return res
    },

    isEmptyDashboard() {
      return (
        !this.displayableProjects.length &&
        !this.displayableEvents.length &&
        !this.displayableInstructions.length
      )
    },
  },

  async mounted() {
    await Promise.all([this.loadProjects(), this.loadEvents(), this.loadInstructions()]).catch(
      (err) => {
        console.error(err)
      }
    )

    this.isLoading = false
  },

  methods: {
    async loadProjects() {
      const query = {
        limit: 3,
        ordering: '-last_update',
        members: [this.usersStore.id],
        // member_role: ['owners', 'members', 'reviewers'].join(','),
        organizations: [this.organizationsStore.current.code],
      } satisfies QueryFilterSearch
      const response = await searchProjects('', { query })
      this.originalProject = response.results.map((result) => result.project)
    },

    async loadEvents() {
      const query = {
        ordering: 'start_date',
        from_date: nowDate().toISOString(),
        limit: this.summaryMaxEvents,
      } satisfies QueryFilterEvent
      this.originalEvents = (
        await getAllEvents(this.organizationsStore.current?.code, {
          query,
        })
      ).results
    },

    async loadInstructions() {
      const query = {
        ordering: '-publication_date',
        to_date: nowDate().toISOString(),
        limit: 1,
      } satisfies QueryFilterInstruction
      this.originalInstructions = (
        await getAllInstructions(this.organizationsStore.current?.code, {
          query,
        })
      ).results
    },
  },
}
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.title-container {
  margin-top: variables.$space-3xl;
  margin-bottom: variables.$space-l;
}

.loading {
  display: flex;
  justify-content: center;
  padding-top: variables.$space-l;
}

.main-title {
  font-weight: 700;
  font-size: variables.$font-size-xl;
  text-align: center;

  @media (min-width: variables.$min-tablet) {
    padding-top: variables.$space-m;
    font-weight: 700;
    font-size: variables.$font-size-4xl;
    line-height: variables.$line-height-squashed;
    text-align: center;
  }
}

.summary-cards {
  padding-inline: 0;

  .summary-container {
    background-color: variables.$primary-lighter;

    @media screen and (min-width: variables.$min-tablet) {
      padding: variables.$space-l;
      display: flex;
      gap: variables.$space-unit;
      align-items: stretch;

      & > :deep(*) {
        flex-basis: 33%;
        flex-grow: 1;
      }
    }
  }
}

.empty-dashboard {
  display: flex;
  justify-content: center;
  padding: variables.$space-l 0;
}
</style>

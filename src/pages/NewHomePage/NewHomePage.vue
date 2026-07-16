<script setup lang="ts">
import RecommendationBlock from '@/components/search/Recommendations/RecommendationBlock.vue'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
const organizationsStore = useOrganizationsStore()
const usersStore = useUsersStore()
const router = useRouter()

const { canCreateProject } = usePermissionProject(null)

const organization = computed(() => organizationsStore.current)
const loggedIn = computed(() => usersStore.isConnected)

const showOnbordingTodos = computed(() => {
  if (!loggedIn.value) return false
  if (!organization.value?.onboarding_enabled) return false
  const status = usersStore.userFromApi?.onboarding_status || {}
  return (
    status.show_progress &&
    (status.complete_profile ||
      status.explore_projects ||
      (status.create_project && canCreateProject.value) ||
      status.take_tour)
  )
})

const search = (options) => {
  router.push({ name: 'Search', query: options })
}

useLpiHead2({})
</script>

<template>
  <div>
    <!-- oboarding todos -->
    <OnboardingTodoBlock v-if="showOnbordingTodos" />

    <HomeHeaderConnected v-if="loggedIn" />
    <HomeHeaderAnonymous v-else />

    <div class="page-section-medium">
      <div class="search-input-container">
        <HomeSearchOptions class="search-options" @search="search" />
      </div>
    </div>
    <div class="page-section-wide bottom-page">
      <div class="projects-and-people">
        <ProjectCategoriesDropdown :dropdown-label="$t('project.categories')">
          <template #default="{ category }">
            <ProjectCategoriesDropdownElementLink :category="category" />
          </template>
        </ProjectCategoriesDropdown>
        <HomeButtons v-if="loggedIn" />
        <LocationsLink />
        <RecommendationBlock />
      </div>
      <div class="all-news">
        <div class="select-news" />
        <div class="news">
          <div class="other-news">
            <HomeNewsfeed />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.search-input-container {
  display: flex;
  padding-top: variables.$space-l;
  padding-bottom: variables.$space-l;
  border-radius: variables.$border-radius-17;
  flex-direction: row;
  position: relative; // higher than home category dropdown and buttons and suggestions
  z-index: 10;

  @media (min-width: variables.$min-desktop) {
    padding-left: variables.$space-2xl;
    padding-right: variables.$space-2xl;
  }
}

.search-options {
  position: relative;
  cursor: pointer;
}

.search-options {
  padding-top: variables.$space-unit;
}

.bottom-page {
  display: flex;
  margin-bottom: variables.$space-l;
  border-radius: variables.$border-radius-17;
  flex-direction: column;
  gap: variables.$space-2xl;

  @media (min-width: variables.$min-desktop) {
    flex-direction: row;
    align-items: flex-start;
  }
}

.projects-and-people {
  margin-bottom: variables.$space-xl;

  @media (min-width: variables.$min-desktop) {
    flex-basis: 35%;
    margin-bottom: 0;
    flex-shrink: 0;
    position: sticky;
    z-index: 1;
    top: -7rem;
  }

  button {
    background-color: variables.$white;
    cursor: pointer;
  }

  .categories {
    border: 1px solid variables.$lighter-gray;
    border-radius: variables.$border-radius-s;
    height: variables.pxtorem(50px);
    display: flex;
    justify-content: space-between;
    padding-inline: variables.$space-m;
    align-items: center;
    width: 100%;

    @media (min-width: variables.$min-desktop) {
      margin-top: variables.$space-l;
    }

    .categories-btn {
      color: variables.$primary-dark;
      font-size: variables.$font-size-m;
      font-weight: 700;
    }

    .caret {
      margin-left: variables.$space-l;
      fill: variables.$primary-dark;
      width: variables.pxtorem(20px);
    }
  }
}

.all-news {
  height: fit-content;

  @media (min-width: variables.$min-desktop) {
    flex-basis: 65%;
  }

  .select-news {
    height: variables.$layout-size-2xl;
  }

  .news {
    height: fit-content;
  }
}
</style>

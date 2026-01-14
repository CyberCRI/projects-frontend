<script setup lang="ts">
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { getOrganizationByCode } from '@/api/organizations.service'
const organizationsStore = useOrganizationsStore()
const usersStore = useUsersStore()
const router = useRouter()

const organization = computed(() => {
  return organizationsStore.current
})

const loggedIn = computed(() => {
  return usersStore.isConnected
})

const showOnbordingTodos = computed(() => {
  if (!loggedIn.value) return false
  if (!organization.value?.onboarding_enabled) return false
  const status = usersStore.userFromApi?.onboarding_status || {}
  return (
    status.show_progress &&
    (status.complete_profile ||
      status.explore_projects ||
      status.create_project ||
      status.take_tour)
  )
})

const search = (options) => {
  router.push({ name: 'Search', query: options })
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    organization?.dashboard_title,
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
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
.search-input-container {
  display: flex;
  padding-top: $space-l;
  padding-bottom: $space-l;
  border-radius: $border-radius-17;
  flex-direction: row;
  position: relative; // higher than home category dropdown and buttons and suggestions
  z-index: 10;

  @media (min-width: $min-tablet) {
    padding-left: $space-2xl;
    padding-right: $space-2xl;
  }
}

.search-options {
  position: relative;
  cursor: pointer;
}

.search-options {
  padding-top: $space-unit;
}

.bottom-page {
  display: flex;
  margin-bottom: $space-l;
  border-radius: $border-radius-17;
  flex-direction: column;
  gap: $space-2xl;

  @media (min-width: $min-tablet) {
    flex-direction: row;
    align-items: flex-start;
  }
}

.projects-and-people {
  margin-bottom: $space-xl;

  @media (min-width: $min-tablet) {
    flex-basis: 35%;
    margin-bottom: 0;
    flex-shrink: 0;
    position: sticky;
    z-index: 1;
    top: -7rem;
  }

  button {
    background-color: $white;
    cursor: pointer;
  }

  .categories {
    border: 1px solid $lighter-gray;
    border-radius: $border-radius-s;
    height: pxToRem(50px);
    display: flex;
    justify-content: space-between;
    padding-inline: $space-m;
    align-items: center;
    width: 100%;

    @media (min-width: $min-tablet) {
      margin-top: $space-l;
    }

    .categories-btn {
      color: $primary-dark;
      font-size: $font-size-m;
      font-weight: 700;
    }

    .caret {
      margin-left: $space-l;
      fill: $primary-dark;
      width: pxToRem(20px);
    }
  }
}

.all-news {
  height: fit-content;

  @media (min-width: $min-tablet) {
    flex-basis: 65%;
  }

  .select-news {
    height: $layout-size-2xl;
  }

  .news {
    height: fit-content;
  }
}
</style>

<script setup>
import useProjectCategories from '@/stores/useProjectCategories.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const { isAdmin, canCreateProject } = usePermissions()
const projectCategoriesStore = useProjectCategories()
const { searchFromQuery } = useSearch('projects')
const { t } = useNuxtI18n()

const forceSearch = ref(false)

if (!projectCategoriesStore._root?.value?.id) {
  await projectCategoriesStore.getRootProjectCategory()
}

const categories = computed(() => {
  return projectCategoriesStore.hierarchy
})

const hasSearch = computed(() => {
  return (
    !!searchFromQuery.value.search ||
    ['sdgs', 'categories', 'tags', 'languages'].reduce(
      (acc, key) => acc || searchFromQuery.value[key]?.length > 0,
      false
    )
  )
})

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    section: 'projects',
  }
})

const isNavigating = ref(false)
onBeforeRouteLeave((to, from, next) => {
  console.log('beh')
  isNavigating.value = true
  if (hasSearch.value) {
    forceSearch.value = true
  }
  next()
})

const showCategories = () => {
  forceSearch.value = false
  navigateTo({ query: {} })
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('projects')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>

<template>
  <div v-if="categories.length > 0" class="categories-layout page-top">
    <div class="page-section-extra-wide">
      <h1 class="page-title">
        {{ $t('projects') }}
      </h1>

      <SearchBlock :limit="30" section="projects" :freeze-search="isNavigating" />
    </div>

    <div v-if="canCreateProject" class="action-ctn page-section-extra-wide">
      <div v-if="projectCategoriesStore._root?.id && isAdmin" class="follow-all">
        <CategoryFollowButton
          :category-id="projectCategoriesStore._root?.id"
          class="follow-button"
          message-follow="category.follow-all-categories"
          message-following="category.following-all-categories"
        />
      </div>
      <LpiButton
        :label="$t('project.create-project')"
        btn-icon="Plus"
        secondary
        data-test="create-project"
        @click="$router.push({ name: 'createProject' })"
      />
    </div>

    <div v-if="hasSearch || forceSearch" class="page-section-wide">
      <GlobalSearchTab :search="fixedSearch" :freeze-search="isNavigating" />
      <div class="btn-ctn">
        <LpiButton :label="$t('category.all-categories')" @click="showCategories" />
      </div>
    </div>
    <template v-else>
      <div class="title-ctn page-section-wide">
        <h2 class="sub-title">
          {{ $t('home.categories.title') }}
        </h2>
      </div>
      <div class="categories page-section-wide">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          class="category"
        />
      </div>

      <div class="btn-ctn">
        <LpiButton :label="$t('category.all-projects')" @click="forceSearch = true" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.categories-layout {
  .btn-ctn {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: $space-2xl 0;
  }

  .action-ctn {
    display: flex;
    align-items: center;

    button {
      margin-left: auto;
    }
  }

  .sub-title {
    text-align: center;
    font-weight: 700;
    font-size: $font-size-2xl;
    line-height: $line-height-tight;
    color: $black;
    width: 100%;
  }

  .title-ctn {
    margin-bottom: $space-xl;
    width: 100%;
  }

  .categories {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: stretch;
    gap: $space-l;
  }
}

.follow-all {
  margin-right: auto;
  width: max-content;
  padding: 1rem;
  border-radius: 1rem;
  background-color: $primary-lighter;
}
</style>

<script setup>
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useSearch from '@/composables/useSearch.js'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const { t } = useI18n()
const route = useRoute()
const { canCreateProject } = usePermissions()
const projectCategoriesStore = useProjectCategories()
const { searchFromQuery } = useSearch('projects')

if (!projectCategoriesStore.all || !projectCategoriesStore.all.length) {
  await projectCategoriesStore.getAllProjectCategories()
}

const category = computed(() => {
  if (props.id) {
    if (import.meta.client) window.scrollTo(0, 0)
    return projectCategoriesStore.allByIds[route.params.id]
  }

  return null
})

const imageSizes = computed(() => {
  const bgImage = category.value?.background_image
  return (bgImage && pictureApiToImageSizes(bgImage)) || null
})
const sortedChildren = computed(() => {
  return [...category.value?.children]?.sort((a, b) => a.order_index - b.order_index) || []
})

const imageSource = computed(() => {
  if (category.value?.background_image) return category.value.background_image?.variations?.full
  else return null
})

const categoryHierarchy = computed(() => {
  return [
    {
      name: t('home.home'),
      route: { name: 'HomeRoot' },
    },
    {
      name: t('category.title'),
      route: { name: 'Categories' },
    },
    ...(category.value?.hierarchy || []).map((cat) => ({
      name: cat.name,
      route: { name: 'Category', params: { id: cat.id } },
    })),
    {
      name: category.value?.name,
      route: { name: 'Category', params: { id: category.value?.id } },
    },
  ]
})

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    categories: [category.value?.id],
    section: 'projects',
  }
})

useLpiHead(
  useRequestURL().toString(),
  category.value?.name,
  category.value?.description,
  category.value?.background_image?.variations?.medium
)
</script>
<template>
  <div v-if="category" id="type" :key="category.id" class="category-layout">
    <div class="breadcrumbs-ctn">
      <BreadCrumbs :breadcrumbs="categoryHierarchy || []" />
    </div>
    <header class="banner-ctn">
      <div class="banner">
        <CategoryCardImage
          :background-color="category.background_color"
          :url="imageSource"
          image-height="433px"
          image-width="100%"
          :image-sizes="imageSizes"
        />
      </div>

      <div class="banner-title-ctn">
        <div class="banner-title">
          <h1 class="category-name">
            {{ category.name }}
          </h1>
          <p class="category-description" v-html="category.description" />
          <div class="category-search">
            <SearchOptions
              ref="searchOptions"
              class="container inline stretch"
              section="projects"
              :filter-black-list="['categories']"
            />
          </div>
        </div>
      </div>
    </header>

    <div class="category-body page-section-extra-wide">
      <div v-if="sortedChildren.length" class="category-children">
        <NuxtLink
          v-for="child in sortedChildren"
          :key="child.id"
          :to="{ name: 'Category', params: { id: child.id } }"
          class="category-child shadow-box"
        >
          <h3 class="child-title">
            {{ child.name }}
          </h3>
        </NuxtLink>
      </div>
      <div class="category-search-header">
        <LpiButton
          v-if="canCreateProject"
          :label="$t('project.create-project')"
          class="button"
          btn-icon="Plus"
          secondary
          data-test="create-project-from-category"
          @click="
            $router.push({
              name: 'createProject',
              query: { category: category.id },
            })
          "
        />
      </div>
      <ClientOnly>
        <GlobalSearchTab :search="fixedSearch" />
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-search-header {
  color: $primary-dark;
  font-size: $font-size-m;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $space-l 0;

  @media screen and (max-width: $max-tablet) {
    margin: $space-l;
  }

  .search-by {
    margin-right: $space-m;
  }

  @media screen and (min-width: $max-tablet) {
    justify-content: flex-end;
  }

  :deep(.lpi-select) {
    margin-left: $space-m;
  }

  &--search-input {
    justify-content: space-between;
    padding: $space-l;
  }
}

.category-layout {
  display: flex;
  flex-direction: column;
  position: relative;

  .banner-ctn {
    position: relative;
  }

  .breadcrumbs-ctn {
    padding-left: $space-xl;
    margin-top: $navbar-height;
  }

  .banner {
    width: 100%;
    z-index: -1;
    left: 0;
    position: relative;

    &-title-ctn {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 $space-l;
    }

    &-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 60%;
      padding: $space-xl $space-l;
      background: rgb(255 255 255 / 75%);
      border-radius: $border-radius-l;

      @media screen and (max-width: $max-tablet) {
        width: 100%;
      }

      .category-name {
        font-weight: 700;
        font-size: $font-size-5xl;
        line-height: $line-height-tight;
        text-align: center;
        margin-bottom: $space-m;
      }

      .category-description {
        font-size: $font-size-m;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 7;
        -webkit-line-clamp: 7;
      }

      .category-search {
        box-sizing: border-box;
        display: flex;
        justify-content: stretch;
        align-items: center;
        gap: $space-unit;
        width: 100%;
        margin-top: $space-l;
        flex-direction: row;

        @media screen and (max-width: $min-tablet) {
          flex-direction: column;
        }

        .search-block {
          flex-grow: 1;
        }

        .button {
          text-transform: capitalize;
        }
      }
    }
  }

  .search-block.inline {
    padding-right: 0;
  }
}

.category-children {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: $space-2xl;

  @media screen and (min-width: $min-tablet) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: $min-desktop) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .category-child {
    display: inline-block;
    padding: $space-m;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-s;
    background-color: $white;

    .child-title {
      font-weight: 700;
      color: $almost-black;
      font-size: $font-size-l;
      line-height: 1.4;
    }
  }
}
</style>

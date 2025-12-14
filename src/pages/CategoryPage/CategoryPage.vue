<script setup>
import useProjectCategories from '@/stores/useProjectCategories.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import useUsersStore from '@/stores/useUsers.ts'
import followUtils from '@/functs/followUtils.ts'

const usersStore = useUsersStore()

const props = defineProps({
  slugOrId: {
    type: [String, Number],
    required: true,
  },
})

const { t } = useNuxtI18n()
const route = useRoute()
const { canCreateProject } = usePermissions()
const projectCategoriesStore = useProjectCategories()
const { searchFromQuery } = useSearch('projects')

if (!projectCategoriesStore.all || !projectCategoriesStore.all.length) {
  await projectCategoriesStore.getAllProjectCategories()
}

const category = computed(() => {
  if (props.slugOrId) {
    if (import.meta.client) window.scrollTo(0, 0)
    return (
      projectCategoriesStore.allBySlugs[route.params.slugOrId] ||
      projectCategoriesStore.allByIds[route.params.slugOrId]
    )
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
      name: cat?.$t?.name,
      route: { name: 'Category', params: { slugOrId: cat.slug || cat.id } },
    })),
    {
      name: category.value?.$t?.name,
      route: { name: 'Category', params: { slugOrId: category.value?.slug || category.value?.id } },
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
const isNavigating = ref(false)
onBeforeRouteLeave((to, from, next) => {
  isNavigating.value = true
  next()
})

const bannerRatio = ref(16 / 9)
function onResize() {
  const rect = document.querySelector('.banner-ctn .banner')?.getBoundingClientRect()
  if (rect?.width && rect?.height) {
    bannerRatio.value = rect.width / rect.height
  }
}
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

const { image, dimensions } = useImageAndDimension(category.value?.background_image, 'medium')
useLpiHead(
  useRequestURL().toString(),
  category.value?.name,
  category.value?.description,
  image,
  dimensions
)

// TODO
const follow = computed(() =>
  usersStore.followedCategories.find((f) => f.category.id === category.value?.id)
)
const followed = computed(() => !!follow.value)

const toggleFollow = async () => {
  try {
    if (follow.value) {
      await followUtils.unfollowCategory({
        follower_id: usersStore.id,
        category_follow_id: follow.value.id,
      })
    } else {
      await followUtils.followCategory({
        follower_id: usersStore.id,
        category_id: category.value.id,
      })
    }
    await usersStore.fetchFollowedCategories()
  } catch (error) {
    console.error('Error updating follow', error)
  }
}
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
          :forced-ratio="bannerRatio"
        />
      </div>

      <div class="banner-title-ctn">
        <div class="banner-title">
          <ExternalLabelButton
            v-if="usersStore.isConnected"
            class="space-button bg-on-hover follow-button"
            :label="followed ? $t('project.followed') : $t('project.follow')"
            :btn-icon="followed ? 'Heart' : 'HeartOutline'"
            vertical-layout
            @click="toggleFollow"
          />

          <h1 class="category-name">
            {{ category?.$t?.name }}
          </h1>
          <p class="category-description" v-html="category?.$t?.description" />
          <div class="category-search">
            <SearchOptions
              ref="searchOptions"
              class="container inline stretch"
              section="projects"
              :filter-black-list="['categories']"
              :freeze-search="isNavigating"
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
          :to="{ name: 'Category', params: { slugOrId: child.slug || child.id } }"
          class="category-child shadow-box"
        >
          <h3 class="child-title">
            {{ child?.$t?.name }}
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
        <GlobalSearchTab :search="fixedSearch" :freeze-search="isNavigating" />
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

.banner-title {
  position: relative;

  .follow-button {
    position: absolute;
    bottom: -2.5rem;
    right: 0;
    transform: translate(-50%, -100%);
    width: 3rem; // fix creepy changing size vs positoning issue
  }
}
</style>

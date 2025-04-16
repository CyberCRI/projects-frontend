<script setup>
import { getHierarchyGroups } from '@/api/groups.service.ts'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useSearch from '@/composables/useSearch.js'
import { getOrganizationByCode } from '@/api/organizations.service'

const props = defineProps({
  groupId: {
    type: String,
    default: '',
  },
})

const organizationsStore = useOrganizationsStore()

const { searchFromQuery } = useSearch('groups')

const { t } = useI18n()

// ???
// const permissions = usePermissions()

const router = useRouter()

const isLoading = useState(() => true)
const groupsIndex = useState(() => null)
const rootId = useState(() => null)

const currentGroup = computed(() => {
  if (!groupsIndex.value) return null
  if (!props.groupId) return groupsIndex.value[rootId.value]
  return groupsIndex.value[props.groupId]
})

const childGroup = computed(() => {
  return (currentGroup.value?.children || [])
    .map((gid) => groupsIndex.value[gid])
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1

      return 0
    })
})

const hierarchy = computed(() => {
  return (currentGroup.value?.hierarchy || []).map((groupId) => groupsIndex.value[groupId])
})

const hasSearch = computed(() => {
  return !!searchFromQuery.value.search
})

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    section: 'groups',
  }
})

watchEffect(() => {
  if (!currentGroup.value && groupsIndex.value && props.groupId) {
    router.push({
      name: 'Groups',
    })
  }
})

const buildIndex = (groups) => {
  const index = {}
  const iterate = (subgroups, hierarchy) => {
    subgroups.forEach((group) => {
      const route = {
        name: 'Groups',
      }
      if (hierarchy.length !== 0) {
        route.params = {
          groupId: group.id,
        }
      }
      index[group.id] = {
        ...group,
        hierarchy: [...hierarchy],
        route,
        children: group.children?.map((g) => g.id) || [],
      }
      // use group id in hierachy an rehydrate when needed
      // to avoid self reference hell
      if (group.children && group.children.length) iterate(group.children, [...hierarchy, group.id])
    })
  }

  iterate(groups ? [groups] : [], [])

  groupsIndex.value = index
}

const loadGroups = async () => {
  isLoading.value = true
  const groups = await getHierarchyGroups(organizationsStore.current.code)
  rootId.value = groups.id
  buildIndex(groups)
  isLoading.value = false
}

const searchOptions = useTemplateRef('searchOptions')

const showGroups = () => {
  searchOptions.value?.deleteQuery()
  searchOptions.value?.clearSelectedFilters()
  nextTick(() => {
    document.querySelector('.page-title')?.scrollIntoView({ behavior: 'smooth' })
  })
}

onMounted(async () => {
  await loadGroups()
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('common.groups')),
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
  <div class="page-section-extra-wide groups-layout page-top">
    <h1 class="page-title">
      {{ $filters.capitalize($t('common.groups')) }}
    </h1>

    <div v-if="!groupId" class="search-input-container">
      <SearchOptions ref="searchOptions" :limit="30" section="groups" />
    </div>
    <div v-if="hasSearch" class="page-section-wide">
      <GlobalSearchTab :search="fixedSearch" />
      <div class="btn-ctn">
        <LpiButton :label="$t('people-groups.browse-tree')" @click="showGroups" />
      </div>
    </div>
    <template v-else>
      <div class="current-group-ctn">
        <div class="breadcrumb">
          <BreadCrumbs
            v-if="hierarchy?.length"
            :breadcrumbs="hierarchy"
            group-name=""
            :is-loading="isLoading"
          />
        </div>
        <div class="current-group">
          <h3 v-if="!isLoading && currentGroup">
            {{ currentGroup.name }} ({{ currentGroup.children.length }})
          </h3>
          <template v-if="isLoading">
            <SkeletonComponent width="110px" class="current-group-skeleton" />
            <SkeletonComponent width="40px" class="current-group-skeleton" />
          </template>
        </div>

        <div class="groups-list">
          <CardList
            :desktop-columns-number="6"
            :is-loading="isLoading"
            :limit="12"
            :items="childGroup"
            class="list-container"
          >
            <template #default="cardListSlotProps">
              <GroupCard
                :group="cardListSlotProps.item"
                :has-sub-groups-link="!!cardListSlotProps.item?.children?.length"
              />
            </template>
          </CardList>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.groups-layout {
  .btn-ctn {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: $space-2xl 0;
  }

  .title-ctn {
    display: inline-flex;
    flex-direction: column;
    margin-bottom: $space-xl;
    width: 100%;

    @media screen and (min-width: $min-tablet) {
      flex-direction: row;
    }
  }

  .button {
    padding: 0;
    width: 100%;
    flex-shrink: 1.5;
  }

  .search-input-container {
    display: flex;
    padding: $space-l;
    background: $primary-lighter;
    align-items: center;
    border-radius: $border-radius-17;
    flex-direction: column;
    margin: $space-xl 0;

    .search-input {
      margin-bottom: pxToRem(16px);
    }

    @media screen and (min-width: $min-tablet) {
      padding: pxToRem(32px) pxToRem(84px);
      border-radius: 17px;
      flex-direction: row;

      .search-input {
        margin-right: $space-l;
        margin-bottom: 0;
      }
    }
  }

  :deep(.search-input-ctn),
  :deep(.search-block) {
    flex-grow: 1;
  }
}

.current-group {
  font-weight: 700;
  font-size: $font-size-l;
  color: $primary-dark;
  display: inline-flex;

  .current-group-skeleton {
    height: $layout-size-l;
    border-radius: $border-radius-m;
    margin-right: $layout-size-s;
  }
}
</style>

<script setup>
import { getHierarchyGroups } from '@/api/groups.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'
import { capitalize } from 'es-toolkit'

const props = defineProps({
  groupId: {
    type: String,
    default: '',
  },
})

const organizationsStore = useOrganizationsStore()

const { searchFromQuery } = useSearch('groups')

const { t } = useNuxtI18n()

// ???
// const permissions = usePermissions()

const router = useRouter()

const isLoading = ref(true)
const groupsIndex = ref(null)
const rootId = ref(null)

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

const isNavigating = ref(false)
onBeforeRouteLeave((to, from, next) => {
  isNavigating.value = true
  next()
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

const showGroups = () => {
  navigateTo({ query: {} })
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
      {{ capitalize($t('common.groups')) }}
    </h1>

    <div v-if="!groupId" class="search-input-container">
      <SearchBlock :limit="30" section="groups" :freeze-search="isNavigating" />
    </div>
    <div v-if="hasSearch" class="page-section-wide">
      <GlobalSearchTab :search="fixedSearch" :freeze-search="isNavigating" />
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
            switchable-display
          >
            <template #default="cardListSlotProps">
              <GroupCard
                :group="cardListSlotProps.item"
                :has-sub-groups-link="!!cardListSlotProps.item?.children?.length"
                :mode="cardListSlotProps.mode"
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

<script setup lang="ts">
import { getGroup, getRootGroups, getSubGroup } from '@/api/v2/group.service'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'
import { useLpiHead2 } from '@/composables/useLpiHead'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { factoriesSkeleton, factoryPagination } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'

const props = withDefaults(defineProps<{ groupId?: string }>(), { groupId: '' })
const organizationCode = useOrganizationCode()

const { searchFromQuery } = useSearch('groups')
const { t } = useNuxtI18n()

// get info from root group organizations
const {
  data: rootGroup,
  status: statusRoot,
  error: errorRoot,
} = getRootGroups(organizationCode, {
  default: () => factoriesSkeleton(groupSkeleton, 5),
})

// if groupId is set, get group info
const groupId = computed(() => parseInt(props.groupId, 10) || null)
const {
  data: currentGroup,
  status: statusGroup,
  error: errorGroup,
} = getGroup(organizationCode, groupId, {
  default: () => groupSkeleton(),
})
const {
  data: subgroups,
  status: statusSubGroup,
  error: errorSubGroup,
  pagination,
} = getSubGroup(organizationCode, groupId, {
  default: () => factoryPagination(groupSkeleton, 5),
})

// return correct status fetch (if not groupId is set)
const status = computed(() => {
  if (groupId.value) {
    return [statusRoot.value, statusGroup.value, statusSubGroup.value]
  }
  return [statusRoot.value]
})

// same as status but for error
const error = computed(() => {
  if (groupId.value) {
    return [errorRoot.value, errorGroup.value, errorSubGroup.value]
  }
  return [errorRoot.value]
})

const hierarchy = computed(() => {
  if (!groupId.value) {
    return []
  }

  return [rootGroup.value, ...currentGroup.value.hierarchy].map((group, idx) => {
    return {
      name: group.name,
      route: {
        name: 'Groups',
        // if firt element (groupRoot) not redirect with id
        params: idx !== 0 ? { groupId: group.id } : null,
      },
    }
  })
})

const hasSearch = computed(() => !!searchFromQuery.value.search)

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

const childGroup = computed<TranslatedPeopleGroupModel[]>(() => {
  return groupId.value ? subgroups.value : rootGroup.value.childrens
})

onMounted(() => console.log('mounted'))
onBeforeUnmount(() => console.log('unmounted'))

const showGroups = () => navigateTo({ query: {} })
useLpiHead2({
  title: computed(() => t('common.groups')),
})
</script>

<template>
  <div class="page-section-extra-wide groups-layout page-top">
    <h1 class="page-title">
      {{ $t('common.groups') }}
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
      <FetchLoader
        :status="status"
        :error="error"
        :error404="{ name: 'Groups' }"
        only-error
        skeleton
      >
        <div class="current-group-ctn">
          <div class="breadcrumb">
            <BreadCrumbs
              v-if="hierarchy.length"
              :breadcrumbs="hierarchy"
              :group-name="
                groupId ? `${currentGroup.$t.name} (${currentGroup.modules.subgroups})` : ''
              "
            />
          </div>
          <div class="groups-list">
            <CardList
              :desktop-columns-number="6"
              :items="childGroup"
              class="list-container"
              switchable-display
            >
              <template #default="cardListSlotProps">
                <GroupCard :group="cardListSlotProps.item" :mode="cardListSlotProps.mode" />
              </template>
            </CardList>
          </div>
          <div class="pagination">
            <PaginationButtonsV2 v-if="groupId" :pagination="pagination" />
          </div>
        </div>
      </FetchLoader>
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

.current-group-ctn {
  margin-bottom: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>

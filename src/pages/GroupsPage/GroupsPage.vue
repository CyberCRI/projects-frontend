<script setup lang="ts">
import { getHierarchyGroups } from '~/api/v2/group.service'
import { useLpiHead2 } from '~/composables/useLpiHead'
import { PeopleGroupModulesKeys } from '~/models/invitation.model'
import { factoriesSkeleton } from '~/skeletons/base.skeletons'
import { groupSkeleton } from '~/skeletons/group.skeletons'

const props = withDefaults(defineProps<{ groupIdOrSlug?: string }>(), { groupIdOrSlug: '' })
const organizationCode = useOrganizationCode()

const { searchFromQuery } = useSearch('groups')
const { t } = useNuxtI18n()

const {
  data: currentGroup,
  isLoading,
  status,
  error,
} = getHierarchyGroups(organizationCode, {
  query: {
    modules: ['members', 'subgroups'] satisfies PeopleGroupModulesKeys[],
    depth: 1,
    parent: props.groupIdOrSlug || undefined,
  },
  // @ts-expect-error children need "id"
  default: () => groupSkeleton({ children: factoriesSkeleton(groupSkeleton, 10) }),
})

const hierarchy = computed(() => {
  if (!currentGroup.value?.hierarchy) {
    return []
  }
  return currentGroup.value.hierarchy.map((group, idx) => {
    return {
      name: group.name,
      route: {
        name: 'Groups',
        // if firt element (groupRoot) not redirect with id
        params: idx !== 0 ? { groupIdOrSlug: group.slug || group.id } : null,
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

    <div v-if="!groupIdOrSlug" class="search-input-container">
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
          <FetchLoader
            :status="status"
            :error="error"
            :error404="{ name: 'Groups' }"
            only-error
            skeleton
          >
            <CardList :limit="12" :items="currentGroup.children" switchable-display>
              <template #default="cardListSlotProps">
                <GroupCard :group="cardListSlotProps.item" :mode="cardListSlotProps.mode" />
              </template>
            </CardList>
          </FetchLoader>
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

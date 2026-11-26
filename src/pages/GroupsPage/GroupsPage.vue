<script setup lang="ts">
import { getHierarchyGroups } from '~/api/v2/group.service'

import { useLpiHead2 } from '~/composables/useLpiHead'

import type {
  PeopleGroupIdOrSlug,
  PeopleGroupModulesKeys,
  QueryFilterGroupHierarchy,
  QueryFilterSearch,
} from 'shared-projects-frontend/models'
import type { ModulesQuery } from 'shared-projects-frontend/interfaces'
import { factoriesSkeleton } from '~/skeletons/base.skeletons'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { deepToRaw } from '~/functs/utils'

const route = useRoute()
const groupIdOrSlug = computed(() => route.params.groupIdOrSlug?.toString() as PeopleGroupIdOrSlug)

const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()

const modulesGroup: ModulesQuery<PeopleGroupModulesKeys> = [
  'members',
  'subgroups',
  'featured_projects',
]

const queryHierarchy = computed<QueryFilterGroupHierarchy>(() => ({
  modules: modulesGroup,
  depth: 1,
  parent: groupIdOrSlug.value,
}))

const {
  data: currentGroup,
  isLoading,
  status,
  error,
} = getHierarchyGroups(organizationCode, {
  query: queryHierarchy,
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

useLpiHead2({
  title: computed(() => t('common.groups')),
})
const query = ref({})
const search = ref('')

const fullQuery = computed(() => {
  const q: QueryFilterSearch = deepToRaw(query.value)

  if (groupIdOrSlug.value) {
    q.group_childs = groupIdOrSlug.value
  } else if (search.value === '') {
    q.only_group_parent_child = true
  }
  return q
})
</script>

<template>
  <div class="page-section-extra-wide groups-layout page-top">
    <h1 class="page-title">
      {{ $t('common.groups') }}
    </h1>

    <FetchLoader :status="status" :error="error" :error404="{ name: 'Groups' }" only-error skeleton>
      <div class="current-group-ctn">
        <div class="breadcrumb">
          <BreadCrumbs
            v-if="hierarchy?.length"
            :breadcrumbs="hierarchy"
            group-name=""
            :is-loading="isLoading"
          />
        </div>
        <NuxtLink
          v-if="groupIdOrSlug"
          class="current-group"
          :to="{
            name: 'Group',
            params: { groupIdOrSlug },
          }"
        >
          <div class="img-ctn">
            <CroppedApiImage
              :alt="`${currentGroup.$t.name} image`"
              class="group-image skeletons-background"
              :picture-data="currentGroup.header_image"
              :default-picture="DEFAULT_GROUP_PATATOID"
            />
          </div>
          <div class="current-group-info">
            <h3 class="skeletons-text">
              {{ currentGroup.name }} ({{ currentGroup.children.length }})
            </h3>
            <GroupRecapPreview :group="currentGroup" :modules="modulesGroup" is-link />
          </div>
        </NuxtLink>
      </div>
      <div class="search-input-container">
        <SearchBlock
          section="people_group"
          @on-query="query = $event"
          @on-search="search = $event"
        />
        <GlobalSearchTab :search="search" :query="fullQuery" mode="people_group" />
      </div>
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.groups-layout {
  .btn-ctn {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: variables.$space-2xl 0;
  }

  .title-ctn {
    display: inline-flex;
    flex-direction: column;
    margin-bottom: variables.$space-xl;
    width: 100%;

    @media screen and (min-width: variables.$min-tablet) {
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
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: variables.$font-size-l;
  color: variables.$primary-dark;
  display: inline-flex;

  .current-group-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
  }
}

$pic-size: variables.pxtorem(169px);

.img-ctn {
  width: $pic-size;
  height: $pic-size;
  border-radius: 100%;
  overflow: hidden;
  flex-shrink: 0;

  .cropped-image {
    width: 100%;
    height: 100%;
  }
}
</style>

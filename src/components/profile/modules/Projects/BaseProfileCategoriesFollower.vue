<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import CategoryCard from '~/components/category/CategoryCard.vue'
import { categorySkeleton } from '~/skeletons/category.skeletons'
import { getUserCategoriesFollower } from '~/api/v2/user.service'
import SectionHeader from '~/components/base/SectionHeader.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
  }>(),
  {
    limit: null,
    preview: false,
  }
)

const profileId = computed(() => props.profile?.id)
const organizationCode = useOrganizationCode()
// TODO: categroies count + category card skeleton
const limitSkeletons = computed(() =>
  maxSkeleton(props.profile?.modules?.categories || 3, props.limit)
)

const {
  status,
  data: categories,
  pagination,
  isLoading,
  //refresh,
} = getUserCategoriesFollower(organizationCode, profileId, {
  paginationConfig: {
    limit: props.limit,
  },
  immediate: profileId.value != -1,
  default: () => factoryPagination(categorySkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader v-if="!preview" :pagination="pagination" :editable="false">
      <SectionHeader
        :title="$t('me.follow-category', categories.length || 0)"
        :quantity="categories.length || 0"
        :has-button="false"
      />
    </BaseModuleHeader>
    <div class="categories-container">
      <CategoryCard v-for="item in categories" :key="item.id" :category="item" />
    </div>
    <EmptyCard
      v-if="!isLoading && categories.length === 0 && !preview"
      class="empty-card"
      :label="$t('me.no-follow')"
    />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-m;
  padding: variables.$space-m 0;
}
</style>

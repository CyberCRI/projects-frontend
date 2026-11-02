<template>
  <div v-if="user.researcher" class="awards-list">
    <FetchLoader :status="status" only-error skeleton>
      <template v-for="award in awards" :key="award.award.id">
        <div class="separator"></div>
        <div class="award">
          <h2 class="award-title">{{ award.date }} - {{ award.name }}</h2>
          <p>
            <span v-if="award.associates?.length" class="associates">
              With
              <span v-for="(associate, index) in award.associates" :key="index">
                <span v-if="index">and</span>
                <NuxtLink :to="associate.link" class="associate-link">
                  {{ associate.name }}
                </NuxtLink>
              </span>
            </span>
            {{ award.award.name }}
          </p>
          <div v-if="award.project">
            <LinkedProjectRow :project="award.project" />
          </div>
        </div>
      </template>
      <NothingHere v-if="!isLoading && awards.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </FetchLoader>
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { awardSkeleton } from '~/skeletons/researcher.skeletons'
import { getAwards } from '~/api/v2/researcher.service'
const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: 20, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.user.modules.awards, props.limit))

const {
  status,
  isLoading,
  data: awards,
  pagination,
  // refresh,
} = getAwards(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(awardSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.associate-link {
  color: variables.$primary-dark;
  font-weight: 600;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
}

.award ~ .separator {
  display: block;
}
</style>

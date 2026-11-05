<template>
  <div v-if="user.researcher" class="awards-list">
    <FetchLoader :status="status" only-error skeleton>
      <template v-for="award in awards" :key="award.award.id">
        <div class="separator"></div>
        <div class="award">
          <h2 class="award-title">{{ award.date }} - {{ award.award.$t.name }}</h2>
          <p>
            {{ award.$t.description || award.award.$t.description }}
          </p>
          <a v-if="award.link" :href="award.link">
            {{ $t('common.see-more') }}
          </a>
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
import { researcherAwardSkeleton } from '~/skeletons/crisalid.skeletons'
import { getResearcherAwards } from '~/api/v2/crisalid.service'
const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: 20, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.awards, props.limit)
)

const {
  status,
  isLoading,
  data: awards,
  pagination,
} = getResearcherAwards(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researcherAwardSkeleton, limitSkeletons.value),
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

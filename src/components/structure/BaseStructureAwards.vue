<template>
  <div v-if="group.researcher" class="awards-list">
    <FetchLoader :status="status" only-error skeleton>
      <template v-for="award in awards" :key="award.award.id">
        <div class="separator"></div>
        <div class="award">
          <h2 class="award-title skeletons-text">
            <span v-if="award.date">{{ formatDate(award.date, locale) }} -</span>
            {{ award.award.$t.name }}
          </h2>
          <p class="skeletons-text">
            {{ award.$t.description || award.award.$t.description }}
          </p>
          <a v-if="award.link" :href="award.link" class="skeletons-background">
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
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { reasearcherAwardSkeleton } from '~/skeletons/crisalid.skeletons'
import { getStructureAwards } from '~/api/v2/crisalid.service'
import { formatDate } from '~/functs/date'

const { locale } = useNuxtI18n()

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const structureId = computed(() => props.group.structure?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group.structure.modules.awards, props.limit)
)

const {
  status,
  isLoading,
  data: awards,
  pagination,
} = getStructureAwards(organizationCode, structureId, {
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

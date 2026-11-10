<template>
  <div v-if="user.researcher" class="patent-list">
    <FetchLoader :status="status" only-error skeleton>
      <template v-for="patent in patents" :key="patent.id">
        <div class="separator"></div>
        <div class="patent-card">
          <h3 class="patent-title skeletons-text">{{ patent.$t.name }}</h3>
          <div class="patent-description skeletons-text">{{ patent.$t.description }}</div>
          <div v-if="patent.link" class="patent-link">
            <LinkButton :label="$t('common.see-more')" btn-icon="ExternalLink" :to="patent.link" />
          </div>
        </div>
      </template>
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </FetchLoader>
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { getResearcherPatents } from '~/api/v2/crisalid.service'
import { patentSkeleton } from '~/skeletons/crisalid.skeletons'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  {
    limit: null,
    preview: false,
  }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.patents, props.limit)
)

const {
  status,
  data: patents,
  pagination,
} = getResearcherPatents(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(patentSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.patent-card {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;

  .patent-title {
    font-size: 1.2rem;
  }

  .patent-link {
    display: flex;
    justify-content: flex-start;
  }
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
  margin-right: 66%;

  @media screen and (max-width: variables.$min-tablet) {
    margin-inline: 17%;
  }
}

.patent-card ~ .separator {
  display: block;
}
</style>

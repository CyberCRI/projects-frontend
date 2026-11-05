<template>
  <div v-if="user.researcher" class="funding-list">
    <FetchLoader :status="status" only-error skeleton>
      <template v-for="funding in fundings" :key="funding.id">
        <div class="separator"></div>
        <div class="funding-card">
          <div class="funding-main">
            <h3 class="funding-title skeletons-text">{{ funding.$t.name }}</h3>
            <div class="funding-description skeletons-text">{{ funding.$t.description }}</div>
            <div class="funding-data">
              <span v-if="funding.prices" class="funding-datum skeletons-background">
                <IconImage
                  v-if="ICON_CURRENCY[funding.currency]"
                  :name="ICON_CURRENCY[funding.currency]"
                  class="icon"
                />
                <span>{{ funding.prices }}</span>
              </span>
              <span
                v-if="funding.start_date || funding.end_date"
                class="funding-datum skeletons-background"
              >
                <IconImage name="Calendar" class="icon" />
                <span v-if="funding.start_date">{{ funding.start_date }}</span>
                <span v-if="funding.end_date">{{ funding.end_date }}</span>
              </span>
            </div>
          </div>
          <div v-if="funding.researchers?.length" class="funding-aside">
            <div class="funding-team">
              <div class="funding-team-head skeletons-background">
                <IconImage class="funding-team-icon" name="Link" />
                <span class="researcher-count">{{ funding.researchers.length }}</span>
              </div>
              <div class="funding-team-label skeletons-text">
                {{ $t('researcher.researchers') }}
              </div>
            </div>
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
import { getResearcherFundings } from '~/api/v2/crisalid.service'
import { fundingSkeleton } from '~/skeletons/crisalid.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { ICON_CURRENCY } from '~/functs/constants'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  {
    limit: 20,
    preview: false,
  }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.fundings, props.limit)
)

const {
  status,
  data: fundings,
  pagination,
} = getResearcherFundings(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(fundingSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.funding-card {
  display: flex;
  gap: 1rem;

  .funding-main {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    flex-grow: 1;
    flex-shrink: 1;
  }

  .funding-title {
    font-size: 1.2rem;
  }

  .funding-data {
    display: flex;
    gap: 2rem;
  }

  .funding-datum {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 500;
    gap: 0.6rem;

    .icon {
      width: 1em;
      height: 1em;
      fill: variables.$primary;
    }
  }

  .funding-aside {
    flex-basis: 6rem;
    flex-shrink: 0;
  }

  .funding-team {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    background-color: variables.$lighter-gray;
    border: 1px solid variables.$mid-gray;
    padding: 1rem;
    border-radius: 4px;
    color: variables.$primary-dark;
  }

  .funding-team-head {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.4rem;

    .funding-team-icon {
      width: 1em;
      height: 1em;
      fill: variables.$primary;
    }
  }

  .funding-team-label {
    font-size: 0.8rem;
  }
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;

  @media screen and (max-width: variables.$min-tablet) {
    margin-inline: 17%;
  }
}

.funding-card ~ .separator {
  display: block;
}
</style>

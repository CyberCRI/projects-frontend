<script setup lang="ts">
import { organizationSkeleton } from '~/skeletons/organizations.skeletons'
import { getOrganizations } from '~/api/v2/organizations.service'
import { factoryPagination } from '~/skeletons/base.skeletons'

const { t } = useNuxtI18n()

const LIMIT = 20

const {
  status,
  data: organizations,
  pagination,
} = getOrganizations({
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(organizationSkeleton, LIMIT),
})

const organisationsFiltered = computed(() =>
  organizations.value.filter((org) => org.is_logo_visible_on_parent_dashboard)
)

useLpiHead2({
  title: computed(() => t('home.communities')),
  description: computed(() => t('portal.sub-title')),
})
</script>

<template>
  <div class="page-section-extra-wide portal-layout page-top">
    <h1 class="page-title">
      {{ $t('home.communities') }}
    </h1>
    <p class="sub-title">
      {{ $t('portal.sub-title') }}
    </p>

    <FetchLoader :status="status" only-error skeleton>
      <div class="org-card-ctn">
        <a
          v-for="organisation in organisationsFiltered"
          :key="organisation.id"
          class="org-card shadow-box skeletons-background"
          :href="organisation.website_url"
          target="_blank"
          :style="{
            backgroundColor: organisation.background_color,
          }"
          :title="organisation.$t.name"
        >
          <div
            class="portal-image"
            :style="{
              backgroundImage: `url(${organisation.logo_image.variations.medium})`,
            }"
          />
        </a>
      </div>
      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<style scoped lang="scss">
.portal-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: $space-2xl;

  .org-card-ctn {
    display: flex;
    flex-flow: column wrap;
    gap: $space-2xl;
    margin-top: $space-xl;
    margin-bottom: $space-xl;

    .org-card {
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items: stretch;
      border-radius: $border-radius-m;
      border: $border-width-s solid var(--primary);
      overflow: hidden;
      padding: $space-m;
      height: pxToRem(96px);
      width: pxToRem(290px);

      .portal-image {
        flex-grow: 1;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}

@media (min-width: $min-tablet) {
  .portal-layout {
    .org-card-ctn {
      flex-direction: row;
      justify-content: center;
      margin-top: $space-3xl;
      margin-bottom: $space-3xl;

      .org-card {
        margin: unset;
      }
    }
  }
}
</style>

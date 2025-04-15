<script setup>
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import GlobalSearchTab from '@/pages/SearchPage/Tabs/GlobalSearchTab.vue'
import useSearch from '@/composables/useSearch.js'
import { getOrganizationByCode } from '@/api/organizations.service'

const { searchFromQuery } = useSearch('people')
const { t } = useI18n()

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    section: 'people',
  }
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('common.people')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>

<template>
  <div class="page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $filters.capitalize($t('common.people')) }}
    </h1>
    <div class="main-ctn">
      <div class="search-input-container">
        <SearchOptions :limit="30" section="people" />
      </div>

      <GlobalSearchTab :search="fixedSearch" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-ctn {
  display: flex;
  flex-direction: column;

  .search-input-container {
    display: flex;
    padding: $space-l;
    background: $primary-lighter;
    align-items: center;
    border-radius: $border-radius-17;
    flex-direction: column;
    margin: $space-xl 0;

    .search-input {
      margin-bottom: pxToRem(16px);
    }

    @media screen and (min-width: $min-tablet) {
      padding: pxToRem(32px) pxToRem(84px);
      border-radius: 17px;
      flex-direction: row;

      .search-input {
        margin-right: $space-l;
        margin-bottom: 0;
      }
    }
  }
}

:deep(.search-input-ctn),
:deep(.search-block) {
  flex-grow: 1;
}
</style>

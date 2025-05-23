<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const organizationsStore = useOrganizationsStore()
const { t } = useI18n()

onMounted(organizationsStore.getAllOrganizations)

const organisations = computed(() => {
  return organizationsStore.all.filter((org) => org.is_logo_visible_on_parent_dashboard)
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('home.communities')),
    computed(() => t('portal.sub-title')),
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="page-section-extra-wide portal-layout page-top">
    <h1 class="page-title">
      {{ $t('home.communities') }}
    </h1>
    <p class="sub-title">
      {{ $t('portal.sub-title') }}
    </p>

    <div class="org-card-ctn">
      <a
        v-for="organisation in organisations"
        :key="organisation.id"
        class="org-card shadow-box"
        :href="organisation.website_url"
        target="_blank"
        :style="{
          backgroundColor: organisation.background_color,
        }"
        :title="organisation.name"
      >
        <div
          class="portal-image"
          :style="{
            backgroundImage: `url(${organisation.logo_image.variations.medium})`,
          }"
        />
      </a>
    </div>
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
      border: $border-width-s solid $primary;
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
